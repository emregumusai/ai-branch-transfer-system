// Branch Recommendation Controller
// Şube öneri controller'ı
// Branch recommendation controller

const branchRepository = require('../repositories/branch.repository');
const branchFilterService = require('../services/branch/filter.service');
const branchCriteriaService = require('../services/branch/criteria.service');
const distanceCalculatorService = require('../services/scoring/distance-calculator.service');
const scoringService = require('../services/scoring/scoring.service');
const aiProviderService = require('../services/ai/ai-provider.service');
const aiPromptBuilderService = require('../services/ai/prompt-builder.service');

/**
 * Branch Recommendation Controller
 * Şube öneri endpoint'lerini yönetir
 * Manages branch recommendation endpoints
 */
class BranchRecommendationController {
    /**
     * AI tabanlı şube önerisi sağlar
     * Provides AI-based branch recommendation
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getRecommendation(req, res) {
        try {
            const { il, konum, secimler } = req.body;

            console.log('👉 1. İstek alındı:', { il, konum, secimlerSayisi: secimler?.length || 0 });

            // 1. TÜM ŞUBELERİ YÜKLE
            // LOAD ALL BRANCHES
            const allBranches = branchRepository.findAll();
            console.log(`✅ ${allBranches.length} şube yüklendi`);

            // 2. MEVCUT ŞUBEYİ BUL
            // FIND CURRENT BRANCH
            const currentBranch = branchRepository.findByName(konum);
            
            if (!currentBranch) {
                return res.status(404).json({ 
                    mesaj: 'Mevcut şube bulunamadı.' 
                });
            }

            console.log(`✅ Mevcut şube bulundu: ${currentBranch.isim}`);

            // 3. COĞRAFİ FİLTRELEME
            // GEOGRAPHIC FILTERING
            const geographicallySuitable = branchFilterService.filterByGeography(
                allBranches,
                il,
                konum
            );

            console.log(`✅ ${geographicallySuitable.length} coğrafi uygun şube`);

            // 4. TÜM ŞUBELER ARASI EN YAKIN ŞUBE (tercihsiz)
            // NEAREST BRANCH AMONG ALL BRANCHES (without preferences)
            const allWithDistance = distanceCalculatorService.calculateDistances(
                currentBranch,
                geographicallySuitable
            );
            
            const nearestOverall = branchFilterService.findNearestBranch(allWithDistance);
            
            console.log(
                `📍 EN YAKIN ŞUBE (tüm şubeler): ${nearestOverall?.isim} ` +
                `(${nearestOverall?.mesafe.toFixed(1)} km)`
            );

            // 5. AKILLI FİLTRELEME HUNİSİ (3 aşamalı)
            // SMART FILTERING FUNNEL (3 stages)
            const { candidates: filteredCandidates, explanation } = 
                branchFilterService.applySmartFilter(geographicallySuitable, secimler);

            console.log(`✅ ${filteredCandidates.length} aday şube filtrelendi`);

            // 6. MESAFE HESAPLA
            // CALCULATE DISTANCES
            const candidatesWithDistance = distanceCalculatorService.calculateDistances(
                currentBranch,
                filteredCandidates
            );

            // 7. SKORLA VE SIRALA
            // SCORE AND SORT
            const scoredCandidates = scoringService.scoreAndSortBranches(
                candidatesWithDistance,
                secimler
            );

            // 8. EN İYİ 5'İ SEÇ
            // SELECT TOP 5
            const topCandidates = scoringService.selectTopCandidates(scoredCandidates);

            scoringService.logScoreDistribution(topCandidates);

            // 9. ADAYLAR İÇİNDEKİ EN YAKIN ŞUBE
            // NEAREST BRANCH WITHIN CANDIDATES
            const nearestInCandidates = branchFilterService.findNearestBranch(topCandidates);
            
            if (nearestInCandidates) {
                console.log(
                    `🎯 Adaylar içinde en yakın: ${nearestInCandidates.isim} ` +
                    `(${nearestInCandidates.mesafe.toFixed(1)} km)`
                );
            }

            // 10. AI PROMPT OLUŞTUR
            // BUILD AI PROMPT
            const prompt = aiPromptBuilderService.buildRecommendationPrompt({
                currentBranch,
                city: il,
                criteria: secimler,
                candidates: topCandidates,
                nearestInCandidates
            });

            // 11. AI'YA GÖNDER
            // SEND TO AI
            console.log('👉 AI\'ya istek gönderiliyor... 🚀');
            
            const aiResponse = await aiProviderService.generateContent(prompt);

            console.log('✅ AI\'dan yanıt alındı');

            // 12. AI YANITINI PARSE ET
            // PARSE AI RESPONSE
            const { recommendation, explanation: aiExplanation } = 
                this._parseAIResponse(aiResponse);

            console.log(`👉 Öneri: ${recommendation}`);

            // 13. BAŞARILI YANIT DÖNDÜR
            // RETURN SUCCESSFUL RESPONSE
            return res.json({
                oneri: recommendation,
                aciklama: aiExplanation || explanation,
                enYakin: nearestOverall?.isim || null
            });

        } catch (error) {
            console.error('❌ Hata:', error.message);
            console.error('Hata detayı:', error);

            // Fallback: En yakın şubeyi döndür
            // Fallback: Return nearest branch
            return this._handleFallback(req, res, error);
        }
    }

    /**
     * AI yanıtını parse eder
     * Parses AI response
     * 
     * @param {string} aiResponse - AI'dan gelen ham yanıt
     * @returns {Object} - { recommendation, explanation }
     */
    _parseAIResponse(aiResponse) {
        // Bold işaretlerini temizle (**, * karakterleri)
        // Clean bold markers (**, * characters)
        const cleaned = aiResponse.replace(/\*\*/g, '').replace(/\*/g, '');

        // "AÇIKLAMA:" delimiter'ına göre ayır
        // Split by "AÇIKLAMA:" delimiter
        const [recommendation, ...explanationParts] = cleaned.split(/\s*AÇIKLAMA:\s*/i);

        return {
            recommendation: recommendation.trim(),
            explanation: explanationParts.join(' ').trim()
        };
    }

    /**
     * Hata durumunda fallback yanıtı döndürür
     * Returns fallback response in case of error
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Error} error - Hata objesi
     */
    _handleFallback(req, res, error) {
        try {
            console.warn('⚠️ Fallback moda geçiliyor...');

            const { il, konum } = req.body;
            const allBranches = branchRepository.findAll();
            const currentBranch = branchRepository.findByName(konum);

            if (!currentBranch) {
                return res.status(500).json({ 
                    mesaj: 'Sunucu hatası ve fallback şube bulunamadı.' 
                });
            }

            const geographicallySuitable = branchFilterService.filterByGeography(
                allBranches,
                il,
                konum
            );

            const withDistance = distanceCalculatorService.calculateDistances(
                currentBranch,
                geographicallySuitable
            );

            const nearest = branchFilterService.findNearestBranch(withDistance);

            return res.json({
                oneri: nearest?.isim || 'Merkez Şube',
                aciklama: '⚠️ TEST MODU: Bu mesafe tabanlı otomatik öneridir. AI servisi geçici olarak kullanılamıyor.',
                enYakin: nearest?.isim || 'Merkez Şube'
            });

        } catch (fallbackError) {
            console.error('❌ Fallback hatası:', fallbackError.message);
            return res.status(500).json({ 
                mesaj: 'Sunucu tarafında bir hata oluştu.' 
            });
        }
    }
}

// Singleton instance
const branchRecommendationController = new BranchRecommendationController();

module.exports = branchRecommendationController;
