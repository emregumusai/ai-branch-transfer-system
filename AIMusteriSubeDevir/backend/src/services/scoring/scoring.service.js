// Scoring Service
// Şube skorlama servisi
// Branch scoring service

const branchCriteriaService = require('../branch/criteria.service');
const {
    SCORING_WEIGHTS,
    DISTANCE_PARAMS,
    PRIORITY_BONUSES,
    SCORE_TOLERANCE,
    TOP_CANDIDATES_COUNT
} = require('../../constants/scoring.constants');

/**
 * Scoring Service
 * Şubeleri mesafe, tercih ve öncelik skoruna göre değerlendirir
 * Evaluates branches based on distance, preference, and priority scores
 */
class ScoringService {
    /**
     * Mesafe skorunu hesaplar (0-30 arası)
     * Calculates distance score (0-30 range)
     * 
     * @param {number} distanceKm - Kilometre cinsinden mesafe / Distance in kilometers
     * @returns {number} - Mesafe skoru / Distance score
     */
    calculateDistanceScore(distanceKm) {
        const { MAX_DISTANCE_KM } = DISTANCE_PARAMS;
        const { DISTANCE } = SCORING_WEIGHTS;

        if (distanceKm <= 0) return DISTANCE;
        if (distanceKm >= MAX_DISTANCE_KM) return 0;

        // Linear interpolasyon: 0 km = 30 puan, 50 km = 0 puan
        // Linear interpolation: 0 km = 30 points, 50 km = 0 points
        return DISTANCE * (1 - (distanceKm / MAX_DISTANCE_KM));
    }

    /**
     * Tercih eşleşme skorunu hesaplar (0-40 arası)
     * Calculates criteria matching score (0-40 range)
     * 
     * @param {Object} branch - Şube objesi / Branch object
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {number} - Tercih skoru / Criteria score
     */
    calculateCriteriaScore(branch, criteria) {
        const { CRITERIA } = SCORING_WEIGHTS;

        if (!criteria || criteria.length === 0) {
            // Tercih yoksa 50% default puan
            // If no criteria, give 50% default score
            return CRITERIA / 2;
        }

        const matchedCount = branchCriteriaService.countMatches(branch, criteria);
        return (matchedCount / criteria.length) * CRITERIA;
    }

    /**
     * Öncelik bonusu skorunu hesaplar (0-30 arası)
     * Calculates priority bonus score (0-30 range)
     * 
     * @param {Object} branch - Şube objesi / Branch object
     * @param {string[]} criteria - Kullanıcı tercihleri (sıralı) / User preferences (ordered)
     * @returns {number} - Öncelik bonusu / Priority bonus
     */
    calculatePriorityBonus(branch, criteria) {
        if (!criteria || criteria.length === 0) {
            return 0;
        }

        let bonus = 0;
        const matchedCriteria = branchCriteriaService.getMatchedCriteria(branch, criteria);

        criteria.forEach((criterion, index) => {
            if (matchedCriteria.includes(criterion) && index < PRIORITY_BONUSES.length) {
                bonus += PRIORITY_BONUSES[index];
            }
        });

        return bonus;
    }

    /**
     * Şube için toplam skor hesaplar (0-100 arası)
     * Calculates total score for branch (0-100 range)
     * 
     * @param {Object} branch - Şube objesi (mesafe bilgisi içermeli) / Branch object (must include distance)
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {Object} - { skor, skorDetay }
     */
    calculateTotalScore(branch, criteria) {
        const distanceScore = this.calculateDistanceScore(branch.mesafe);
        const criteriaScore = this.calculateCriteriaScore(branch, criteria);
        const priorityBonus = this.calculatePriorityBonus(branch, criteria);

        const totalScore = distanceScore + criteriaScore + priorityBonus;

        return {
            skor: totalScore,
            skorDetay: {
                mesafePuani: distanceScore.toFixed(1),
                tercihPuani: criteriaScore.toFixed(1),
                oncelikBonusu: priorityBonus.toFixed(1)
            }
        };
    }

    /**
     * Şube listesini skorlar ve sıralar
     * Scores and sorts branch list
     * 
     * @param {Array} branches - Şube listesi (mesafe bilgisi içermeli) / Branch list (must include distance)
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {Array} - Skorlanmış ve sıralanmış şube listesi / Scored and sorted branch list
     */
    scoreAndSortBranches(branches, criteria) {
        const scoredBranches = branches.map(branch => {
            const { skor, skorDetay } = this.calculateTotalScore(branch, criteria);
            return {
                ...branch,
                skor,
                skorDetay
            };
        });

        // Skora göre sırala (en yüksek skor önce)
        // Beraberlik durumunda mesafeye göre sırala
        // Sort by score (highest first)
        // If tie, sort by distance
        scoredBranches.sort((a, b) => {
            const scoreDiff = b.skor - a.skor;

            // Skorlar çok yakınsa mesafeye bak
            // If scores are very close, check distance
            if (Math.abs(scoreDiff) < SCORE_TOLERANCE) {
                return a.mesafe - b.mesafe;
            }

            return scoreDiff;
        });

        return scoredBranches;
    }

    /**
     * En iyi N şubeyi seçer
     * Selects top N branches
     * 
     * @param {Array} scoredBranches - Skorlanmış şube listesi / Scored branch list
     * @param {number} count - Seçilecek şube sayısı / Number of branches to select (default: 5)
     * @returns {Array} - En iyi N şube / Top N branches
     */
    selectTopCandidates(scoredBranches, count = TOP_CANDIDATES_COUNT) {
        return scoredBranches.slice(0, count);
    }

    /**
     * Skor dağılımını konsola yazdırır (debug için)
     * Prints score distribution to console (for debugging)
     * 
     * @param {Array} scoredBranches - Skorlanmış şube listesi / Scored branch list
     */
    logScoreDistribution(scoredBranches) {
        console.log('📊 Skor Dağılımı (Mesafe + Tercih + Öncelik):');
        scoredBranches.forEach(branch => {
            const { isim, skor, skorDetay, mesafe } = branch;
            console.log(
                `   ${isim}: ${skor.toFixed(1)} puan ` +
                `(Mesafe: ${skorDetay.mesafePuani}p, ` +
                `Tercih: ${skorDetay.tercihPuani}p, ` +
                `Öncelik: ${skorDetay.oncelikBonusu}p) - ` +
                `${mesafe.toFixed(1)} km`
            );
        });
    }
}

// Singleton instance
const scoringService = new ScoringService();

module.exports = scoringService;
