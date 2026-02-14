// Branch Criteria Service
// Şube kriterleri eşleştirme servisi
// Branch criteria matching service

const { CRITERIA_MAPPINGS } = require('../../constants/criteria.constants');

/**
 * Branch Criteria Service
 * Şubelerin tercihlere uygunluğunu kontrol eder
 * Checks branch compliance with customer preferences
 */
class BranchCriteriaService {
    /**
     * Şubenin verilen kriterlerin EN AZ BİRİNE uyup uymadığını kontrol eder
     * Checks if branch matches AT LEAST ONE of the given criteria
     * 
     * @param {Object} branch - Kontrol edilecek şube / Branch to check
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {boolean} - En az bir kritere uyuyorsa true / True if matches at least one criterion
     */
    matchesAny(branch, criteria) {
        // Eğer tercih yoksa, tüm şubeler uygun kabul edilir
        // If no preferences, all branches are considered suitable
        if (!criteria || criteria.length === 0) {
            return true;
        }

        // En az bir kritere uyuyor mu?
        // Does it match at least one criterion?
        return criteria.some(criterion => {
            const matchFunction = CRITERIA_MAPPINGS[criterion];
            return matchFunction ? matchFunction(branch) : false;
        });
    }

    /**
     * Şubenin verilen kriterlerin TÜMÜne uyup uymadığını kontrol eder
     * Checks if branch matches ALL of the given criteria
     * 
     * @param {Object} branch - Kontrol edilecek şube / Branch to check
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {boolean} - Tüm kriterlere uyuyorsa true / True if matches all criteria
     */
    matchesAll(branch, criteria) {
        // Eğer tercih yoksa, tüm şubeler uygun kabul edilir
        // If no preferences, all branches are considered suitable
        if (!criteria || criteria.length === 0) {
            return true;
        }

        // Tüm kriterlere uyuyor mu?
        // Does it match all criteria?
        return criteria.every(criterion => {
            const matchFunction = CRITERIA_MAPPINGS[criterion];
            return matchFunction ? matchFunction(branch) : true; // Tanımsız kriter varsa true kabul et
        });
    }

    /**
     * Şubenin kaç kritere uyduğunu sayar
     * Counts how many criteria the branch matches
     * 
     * @param {Object} branch - Kontrol edilecek şube / Branch to check
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {number} - Eşleşen kriter sayısı / Number of matched criteria
     */
    countMatches(branch, criteria) {
        if (!criteria || criteria.length === 0) {
            return 0;
        }

        return criteria.filter(criterion => {
            const matchFunction = CRITERIA_MAPPINGS[criterion];
            return matchFunction ? matchFunction(branch) : false;
        }).length;
    }

    /**
     * Şubenin hangi kriterlere uyduğunu listeler
     * Lists which criteria the branch matches
     * 
     * @param {Object} branch - Kontrol edilecek şube / Branch to check
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {string[]} - Eşleşen kriterler / Matched criteria
     */
    getMatchedCriteria(branch, criteria) {
        if (!criteria || criteria.length === 0) {
            return [];
        }

        return criteria.filter(criterion => {
            const matchFunction = CRITERIA_MAPPINGS[criterion];
            return matchFunction ? matchFunction(branch) : false;
        });
    }

    /**
     * Şubenin hangi kriterlere uymadığını listeler
     * Lists which criteria the branch does NOT match
     * 
     * @param {Object} branch - Kontrol edilecek şube / Branch to check
     * @param {string[]} criteria - Kullanıcı tercihleri / User preferences
     * @returns {string[]} - Eşleşmeyen kriterler / Unmatched criteria
     */
    getUnmatchedCriteria(branch, criteria) {
        if (!criteria || criteria.length === 0) {
            return [];
        }

        return criteria.filter(criterion => {
            const matchFunction = CRITERIA_MAPPINGS[criterion];
            return matchFunction ? !matchFunction(branch) : true;
        });
    }
}

// Singleton instance
const branchCriteriaService = new BranchCriteriaService();

module.exports = branchCriteriaService;
