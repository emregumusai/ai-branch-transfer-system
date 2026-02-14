// AI Prompt Builder Service
// AI prompt oluşturma servisi
// AI prompt building service

/**
 * AI Prompt Builder Service
 * AI'ya gönderilecek prompt'ları yapılandırır
 * Constructs prompts to be sent to AI
 */
class AIPromptBuilderService {
    /**
     * Şube öneri prompt'u oluşturur
     * Builds branch recommendation prompt
     * 
     * @param {Object} params - Prompt parametreleri
     * @param {Object} params.currentBranch - Mevcut şube bilgisi
     * @param {string} params.city - İl
     * @param {string[]} params.criteria - Tercihler (öncelik sırasıyla)
     * @param {Array} params.candidates - Aday şubeler (skorlanmış)
     * @param {Object} params.nearestInCandidates - Adaylar içindeki en yakın şube
     * @returns {string} - Yapılandırılmış prompt
     */
    buildRecommendationPrompt({ currentBranch, city, criteria, candidates, nearestInCandidates }) {
        const customerProfile = this._buildCustomerProfile(currentBranch, city);
        const priorityList = this._buildPriorityList(criteria);
        const candidatesList = this._buildCandidatesList(candidates);
        const nearestInfo = this._buildNearestInfo(nearestInCandidates);
        const task = this._buildTask();
        const rules = this._buildRules();
        const format = this._buildResponseFormat();

        return `
## MÜŞTERİ PROFİLİ
${customerProfile}

## ⭐ TERCİH ÖNCELİK SIRALAMASI (Yukarıdan aşağıya önem sırası)
${priorityList}

## EN UYGUN ${candidates.length} ADAY ŞUBE (Tercih filtreleme ve skorlamaya göre seçilmiş)
${candidatesList}

${nearestInfo}

## 🎯 GÖREV
${task}

### ⚠️ KRİTİK KURALLAR:
${rules}

### ⚠️ CEVAP FORMATI (KATIYETLE UYULMASI GEREKEN):
${format}
        `.trim();
    }

    /**
     * Müşteri profili bölümünü oluşturur
     * Builds customer profile section
     */
    _buildCustomerProfile(currentBranch, city) {
        return `- Mevcut Şube: ${currentBranch.isim}
- Lokasyon: ${city} / ${currentBranch.ilce}
- Koordinatlar: ${currentBranch.koordinat.lat}, ${currentBranch.koordinat.lon}`;
    }

    /**
     * Öncelik listesi bölümünü oluşturur
     * Builds priority list section
     */
    _buildPriorityList(criteria) {
        if (!criteria || criteria.length === 0) {
            return 'Kullanıcı özel tercih belirtmedi (tüm şubeler eşit değerlendirilecek)';
        }

        const priorityLabels = ['🥇 1. ÖNCELİK', '🥈 2. ÖNCELİK', '🥉 3. ÖNCELİK', '4. ÖNCELİK'];

        return criteria
            .map((criterion, index) => {
                const label = priorityLabels[index] || `${index + 1}. ÖNCELİK`;
                return `${label}: ${criterion}`;
            })
            .join('\n');
    }

    /**
     * Aday şubeler listesi bölümünü oluşturur
     * Builds candidates list section
     */
    _buildCandidatesList(candidates) {
        return candidates
            .map((branch, index) => {
                const features = this._formatBranchFeatures(branch);
                const scoreInfo = this._formatScoreInfo(branch);

                return `${index + 1}. ${branch.isim}
   - Lokasyon: ${branch.il} / ${branch.ilce}
   - Mesafe: ${branch.mesafe.toFixed(1)} km
   - Tip: ${branch.tip}
   - Hizmet Türleri: ${branch.hizmetTurleri.join(', ')}
   - Özellikler:
${features}
   - Uygunluk Skoru: ${scoreInfo}`;
            })
            .join('\n\n');
    }

    /**
     * Şube özelliklerini formatlar
     * Formats branch features
     */
    _formatBranchFeatures(branch) {
        return `     * ATM Sayısı: ${branch.atmSayisi}
     * Yoğunluk: ${branch.yogunluk}
     * Erişilebilirlik: ${branch.erisilebilirlik ? 'Var' : 'Yok'}
     * Park Yeri: ${branch.parkYeri ? 'Var' : 'Yok'}
     * Uzun Çalışma Saatleri: ${branch.uzunCalismaSaatleri ? 'Var' : 'Yok'}
     * Kolay Ulaşım: ${branch.kolayUlasim ? 'Var' : 'Yok'}`;
    }

    /**
     * Skor bilgisini formatlar
     * Formats score information
     */
    _formatScoreInfo(branch) {
        const { skor, skorDetay } = branch;
        return `${skor.toFixed(1)}/100 (Mesafe: ${skorDetay.mesafePuani}, Tercih: ${skorDetay.tercihPuani}, Öncelik Bonusu: ${skorDetay.oncelikBonusu})`;
    }

    /**
     * En yakın şube bilgisini oluşturur
     * Builds nearest branch information
     */
    _buildNearestInfo(nearestBranch) {
        if (!nearestBranch) {
            return '⚠️ **ÖNEMLİ NOT:** Yukarıdaki şubeler, müşteri tercihlerine göre filtrelenerek seçilmiştir.';
        }

        return `⚠️ **ÖNEMLİ NOT:** Yukarıdaki ${nearestBranch ? '5' : ''} şube, tüm şubeler arasından müşteri tercihlerine göre filtrelenerek seçilmiştir. Daha fazla şube var ancak bunlar tercihlere uygun değil. Bu ${nearestBranch ? '5' : ''} aday içinde en yakın: **${nearestBranch.isim}** (${nearestBranch.mesafe.toFixed(1)} km)`;
    }

    /**
     * Görev tanımını oluşturur
     * Builds task definition
     */
    _buildTask() {
        return `Yukarıdaki **5 ADAY** arasından (tüm şubeler değil!), müşterinin **TERCİH ÖNCELİK SIRALAMASI**'na göre **EN UYGUN TEK BİR** şubeyi seç.`;
    }

    /**
     * Kurallar bölümünü oluşturur
     * Builds rules section
     */
    _buildRules() {
        return `1. **1. ÖNCELİK (🥇) EN ÖNEMLİDİR**: Müşterinin birinci tercihi mutlaka ön planda tutulmalıdır
2. **ÖNCELİK SIRASI HAYATİDİR**: İkinci, üçüncü ve dördüncü tercihler de sırasıyla değerlendirilmelidir
3. **MESAFE BİR FAKTÖRDÜR AMA TEK FAKTÖR DEĞİLDİR**: Çok uzak (>30km) şubeler dezavantajlı AMA yakın olmak tek başına yeterli değil
4. **SKOR BİR REHBERDİR**: Uygunluk skorları iyi bir başlangıç noktasıdır ama kendi analizini mutlaka yap
5. **DENGELİ DEĞERLENDİRME**: Öncelikler + Mesafe + Hizmet Türleri üçgeninde en dengeli çözümü bul`;
    }

    /**
     * Yanıt formatını oluşturur
     * Builds response format
     */
    _buildResponseFormat() {
        return `ŞUBE_ADI
AÇIKLAMA: [SADECE 1 KISA CÜMLE - Maksimum 15-20 kelime - Hangi önceliği karşılıyor kısaca belirt. "Tek şube" gibi ifadeler KULLANMA]

ÖRNEK:
Kadıköy Şubesi
AÇIKLAMA: En önemli tercihleriniz olan park yeri ve düşük yoğunluk mevcut, ayrıca adaylar içinde en yakın.`;
    }
}

// Singleton instance
const aiPromptBuilderService = new AIPromptBuilderService();

module.exports = aiPromptBuilderService;
