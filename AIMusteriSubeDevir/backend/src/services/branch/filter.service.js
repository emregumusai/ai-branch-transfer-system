// Branch Filter Service
// Şube filtreleme servisi
// Branch filtering service

const branchCriteriaService = require('./criteria.service');

/**
 * Branch Filter Service
 * Coğrafi ve kriter bazlı şube filtreleme
 * Geographic and criteria-based branch filtering
 */
class BranchFilterService {
    /**
     * Coğrafi olarak uygun şubeleri filtreler
     * Filters geographically suitable branches
     * 
     * @param {Array} allBranches - Tüm şubeler / All branches
     * @param {string} targetCity - Hedef il / Target city
     * @param {string} currentBranchName - Mevcut şube adı (hariç tutulacak) / Current branch name (to exclude)
     * @returns {Array} - Coğrafi olarak uygun şubeler / Geographically suitable branches
     */
    filterByGeography(allBranches, targetCity, currentBranchName) {
        return allBranches.filter(branch =>
            (branch.il === targetCity || branch.komsuIllerIcin === true) &&
            branch.isim !== currentBranchName
        );
    }

    /**
     * Akıllı filtreleme hunisi - 3 aşamalı
     * Smart filtering funnel - 3 stages
     * 
     * @param {Array} geographicallySuitableBranches - Coğrafi uygun şubeler / Geographically suitable branches
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {Object} - { candidates: Array, explanation: string }
     */
    applySmartFilter(geographicallySuitableBranches, criteria) {
        let candidates = [];
        let explanation = '';

        // 1. ADIM: Tam eşleşenleri bul (TÜM kriterlere uyanlar)
        // STEP 1: Find perfect matches (matching ALL criteria)
        const perfectMatches = geographicallySuitableBranches.filter(branch =>
            branchCriteriaService.matchesAll(branch, criteria)
        );

        if (perfectMatches.length > 0) {
            candidates = perfectMatches;
            explanation = 'Tüm tercihlerinize tam olarak uyan şubeler bulundu ve değerlendirmeye alındı.';
            console.log(`✅ Aşama 1: ${perfectMatches.length} TAM EŞLEŞME bulundu`);
        } else {
            // 2. ADIM: Kısmi eşleşenleri bul (EN AZ 1 kritere uyanlar)
            // STEP 2: Find partial matches (matching AT LEAST 1 criterion)
            const partialMatches = geographicallySuitableBranches.filter(branch =>
                branchCriteriaService.matchesAny(branch, criteria)
            );

            if (partialMatches.length > 0) {
                candidates = partialMatches;
                explanation = 'Tercihlerinize tam uyan şube bulunamadı, ancak en az bir kritere uyan şubeler öneri için değerlendiriliyor.';
                console.log(`⚠️ Aşama 2: ${partialMatches.length} KISMI EŞLEŞME bulundu`);
            } else {
                // 3. ADIM: Son çare - coğrafi olarak uygun tüm şubeler
                // STEP 3: Last resort - all geographically suitable branches
                candidates = geographicallySuitableBranches;
                explanation = 'Tercihlerinize özel bir şube bulunamadı. Size en uygun olabilecek şubeyi belirlemek için bulunduğunuz il ve komşu illerdeki tüm şubeler değerlendiriliyor.';
                console.log(`🔄 Aşama 3: ${geographicallySuitableBranches.length} COĞRAFİ UYGUN şube (son çare)`);
            }
        }

        return {
            candidates,
            explanation
        };
    }

    /**
     * En yakın şubeyi bulur (tüm şubeler arasından)
     * Finds nearest branch (from all branches)
     * 
     * @param {Array} branches - Şube listesi (mesafe bilgisi içermeli) / Branch list (must include distance info)
     * @returns {Object|null} - En yakın şube / Nearest branch
     */
    findNearestBranch(branches) {
        if (!branches || branches.length === 0) {
            return null;
        }

        return branches.reduce((nearest, branch) =>
            branch.mesafe < nearest.mesafe ? branch : nearest
        );
    }

    /**
     * Şube listesini mesafeye göre sıralar
     * Sorts branch list by distance
     * 
     * @param {Array} branches - Şube listesi / Branch list
     * @returns {Array} - Sıralanmış şube listesi / Sorted branch list
     */
    sortByDistance(branches) {
        return [...branches].sort((a, b) => a.mesafe - b.mesafe);
    }
}

// Singleton instance
const branchFilterService = new BranchFilterService();

module.exports = branchFilterService;
