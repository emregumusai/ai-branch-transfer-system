// Distance Calculator Service
// Mesafe hesaplama servisi
// Distance calculation service

const { calculateDistance } = require('../../utils/distance.util');

/**
 * Distance Calculator Service
 * Şubeler için mesafe hesaplama işlemlerini yönetir
 * Manages distance calculation operations for branches
 */
class DistanceCalculatorService {
    /**
     * Referans şubeye göre tüm şubelerin mesafelerini hesaplar
     * Calculates distances of all branches relative to reference branch
     * 
     * @param {Object} referenceBranch - Referans şube / Reference branch
     * @param {Array} branches - Şube listesi / Branch list
     * @returns {Array} - Mesafe bilgisi eklenmiş şube listesi / Branch list with distance info
     */
    calculateDistances(referenceBranch, branches) {
        const { lat: refLat, lon: refLon } = referenceBranch.koordinat;

        return branches.map(branch => {
            const { lat, lon } = branch.koordinat;
            const distance = calculateDistance(refLat, refLon, lat, lon);

            return {
                ...branch,
                mesafe: distance
            };
        });
    }

    /**
     * Tek bir şubenin referans şubeye olan mesafesini hesaplar
     * Calculates distance of a single branch to reference branch
     * 
     * @param {Object} referenceBranch - Referans şube / Reference branch
     * @param {Object} targetBranch - Hedef şube / Target branch
     * @returns {number} - Kilometre cinsinden mesafe / Distance in kilometers
     */
    calculateSingleDistance(referenceBranch, targetBranch) {
        const { lat: refLat, lon: refLon } = referenceBranch.koordinat;
        const { lat: targetLat, lon: targetLon } = targetBranch.koordinat;

        return calculateDistance(refLat, refLon, targetLat, targetLon);
    }

    /**
     * Şube listesini mesafeye göre sıralar ve en yakınları döndürür
     * Sorts branches by distance and returns nearest ones
     * 
     * @param {Array} branchesWithDistance - Mesafe bilgisi içeren şubeler / Branches with distance info
     * @param {number} count - Döndürülecek şube sayısı / Number of branches to return (default: all)
     * @returns {Array} - Mesafeye göre sıralanmış şubeler / Branches sorted by distance
     */
    getNearestBranches(branchesWithDistance, count = null) {
        const sorted = [...branchesWithDistance].sort((a, b) => a.mesafe - b.mesafe);
        return count ? sorted.slice(0, count) : sorted;
    }

    /**
     * Belirli bir mesafe yarıçapındaki şubeleri filtreler
     * Filters branches within a specific distance radius
     * 
     * @param {Array} branchesWithDistance - Mesafe bilgisi içeren şubeler / Branches with distance info
     * @param {number} radiusKm - Yarıçap (kilometre) / Radius (kilometers)
     * @returns {Array} - Yarıçap içindeki şubeler / Branches within radius
     */
    filterByRadius(branchesWithDistance, radiusKm) {
        return branchesWithDistance.filter(branch => branch.mesafe <= radiusKm);
    }

    /**
     * Ortalama mesafeyi hesaplar
     * Calculates average distance
     * 
     * @param {Array} branchesWithDistance - Mesafe bilgisi içeren şubeler / Branches with distance info
     * @returns {number} - Ortalama mesafe / Average distance
     */
    calculateAverageDistance(branchesWithDistance) {
        if (!branchesWithDistance || branchesWithDistance.length === 0) {
            return 0;
        }

        const total = branchesWithDistance.reduce((sum, branch) => sum + branch.mesafe, 0);
        return total / branchesWithDistance.length;
    }
}

// Singleton instance
const distanceCalculatorService = new DistanceCalculatorService();

module.exports = distanceCalculatorService;
