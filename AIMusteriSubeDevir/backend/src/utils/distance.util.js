// Distance Utility
// Mesafe hesaplama yardımcı fonksiyonları
// Distance calculation utility functions

const { DISTANCE_PARAMS } = require('../constants/scoring.constants');

/**
 * Haversine formülü ile iki coğrafi nokta arasındaki mesafeyi hesaplar
 * Calculates distance between two geographic points using Haversine formula
 * 
 * @param {number} lat1 - İlk noktanın enlemi / Latitude of first point
 * @param {number} lon1 - İlk noktanın boylamı / Longitude of first point
 * @param {number} lat2 - İkinci noktanın enlemi / Latitude of second point
 * @param {number} lon2 - İkinci noktanın boylamı / Longitude of second point
 * @returns {number} - Kilometre cinsinden mesafe / Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = DISTANCE_PARAMS.EARTH_RADIUS_KM;
    
    // Enlem ve boylam farklarını radyana çevir
    // Convert latitude and longitude differences to radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    // Haversine formülü
    // Haversine formula
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Kilometre cinsinden mesafe / Distance in kilometers
}

/**
 * Dereceyi radyana çevirir
 * Converts degrees to radians
 * 
 * @param {number} degrees - Derece değeri / Degree value
 * @returns {number} - Radian değeri / Radian value
 */
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Mesafeyi formatlı string olarak döndürür
 * Returns distance as formatted string
 * 
 * @param {number} distanceKm - Kilometre cinsinden mesafe / Distance in kilometers
 * @param {number} decimalPlaces - Ondalık basamak sayısı / Number of decimal places (default: 1)
 * @returns {string} - Formatlanmış mesafe / Formatted distance (e.g., "5.2 km")
 */
function formatDistance(distanceKm, decimalPlaces = 1) {
    return `${distanceKm.toFixed(decimalPlaces)} km`;
}

/**
 * Mesafenin çok uzak olup olmadığını kontrol eder
 * Checks if distance is considered very far
 * 
 * @param {number} distanceKm - Kilometre cinsinden mesafe / Distance in kilometers
 * @returns {boolean} - Çok uzak ise true / True if very far
 */
function isVeryFar(distanceKm) {
    return distanceKm > DISTANCE_PARAMS.VERY_FAR_THRESHOLD_KM;
}

module.exports = {
    calculateDistance,
    toRadians,
    formatDistance,
    isVeryFar
};
