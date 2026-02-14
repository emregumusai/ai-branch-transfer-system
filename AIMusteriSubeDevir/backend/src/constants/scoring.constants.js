// Scoring Constants
// Skor hesaplama sabitleri ve ağırlıkları
// Scoring calculation constants and weights

/**
 * Skor hesaplama ağırlıkları (toplamı 100 olmalı)
 * Scoring calculation weights (must sum to 100)
 */
const SCORING_WEIGHTS = {
    DISTANCE: 30,    // Mesafe ağırlığı / Distance weight (30%)
    CRITERIA: 40,    // Tercih eşleşme ağırlığı / Criteria matching weight (40%)
    PRIORITY: 30     // Öncelik bonusu ağırlığı / Priority bonus weight (30%)
};

/**
 * Mesafe hesaplama parametreleri
 * Distance calculation parameters
 */
const DISTANCE_PARAMS = {
    MAX_DISTANCE_KM: 50,           // Maksimum etkili mesafe (km) / Maximum effective distance (km)
    VERY_FAR_THRESHOLD_KM: 30,     // Çok uzak eşiği (km) / Very far threshold (km)
    EARTH_RADIUS_KM: 6371          // Dünya yarıçapı (km) / Earth radius (km)
};

/**
 * Öncelik bonusları (sırayla azalan)
 * Priority bonuses (decreasing order)
 */
const PRIORITY_BONUSES = [20, 15, 10, 7]; // 1., 2., 3., 4. tercih için / For 1st, 2nd, 3rd, 4th priority

/**
 * Skor toleransı (yaklaşık eşitlik için)
 * Score tolerance (for approximate equality)
 */
const SCORE_TOLERANCE = 0.5;

/**
 * En iyi N aday seçimi
 * Select top N candidates
 */
const TOP_CANDIDATES_COUNT = 5;

module.exports = {
    SCORING_WEIGHTS,
    DISTANCE_PARAMS,
    PRIORITY_BONUSES,
    SCORE_TOLERANCE,
    TOP_CANDIDATES_COUNT
};
