// Branch Repository
// Şube verileri erişim katmanı (Repository Pattern)
// Branch data access layer (Repository Pattern)

const fs = require('fs');
const { databaseConfig } = require('../config/database.config');

/**
 * Branch Repository Class
 * JSON dosyasından şube verilerini yönetir
 * Manages branch data from JSON file
 */
class BranchRepository {
    constructor() {
        this.filePath = databaseConfig.branchesPath;
        this.encoding = databaseConfig.encoding;
    }

    /**
     * Tüm şubeleri getirir
     * Gets all branches
     * 
     * @returns {Array} - Şube listesi / List of branches
     */
    findAll() {
        try {
            const rawData = fs.readFileSync(this.filePath, this.encoding);
            const data = JSON.parse(rawData);
            return data.subeler || [];
        } catch (error) {
            console.error('❌ Error reading branches file:', error.message);
            throw new Error('Failed to load branches data');
        }
    }

    /**
     * ID'ye göre şube bulur
     * Finds branch by ID
     * 
     * @param {number} id - Şube ID / Branch ID
     * @returns {Object|null} - Şube objesi veya null / Branch object or null
     */
    findById(id) {
        const branches = this.findAll();
        return branches.find(branch => branch.id === id) || null;
    }

    /**
     * İsme göre şube bulur
     * Finds branch by name
     * 
     * @param {string} name - Şube ismi / Branch name
     * @returns {Object|null} - Şube objesi veya null / Branch object or null
     */
    findByName(name) {
        const branches = this.findAll();
        return branches.find(branch => branch.isim === name) || null;
    }

    /**
     * İle göre şubeleri getirir
     * Gets branches by city
     * 
     * @param {string} city - İl adı / City name
     * @returns {Array} - Şube listesi / List of branches
     */
    findByCity(city) {
        const branches = this.findAll();
        return branches.filter(branch => branch.il === city);
    }

    /**
     * İlçeye göre şubeleri getirir
     * Gets branches by district
     * 
     * @param {string} district - İlçe adı / District name
     * @returns {Array} - Şube listesi / List of branches
     */
    findByDistrict(district) {
        const branches = this.findAll();
        return branches.filter(branch => branch.ilce === district);
    }

    /**
     * Komşu illere hizmet veren şubeleri getirir
     * Gets branches that serve neighboring cities
     * 
     * @returns {Array} - Şube listesi / List of branches
     */
    findNeighboringCityProviders() {
        const branches = this.findAll();
        return branches.filter(branch => branch.komsuIllerIcin === true);
    }

    /**
     * Filtreleme fonksiyonuna göre şube bulur
     * Finds branches by filter function
     * 
     * @param {Function} filterFn - Filtreleme fonksiyonu / Filter function
     * @returns {Array} - Şube listesi / List of branches
     */
    findByFilter(filterFn) {
        const branches = this.findAll();
        return branches.filter(filterFn);
    }

    /**
     * Şube sayısını döndürür
     * Returns total branch count
     * 
     * @returns {number} - Şube sayısı / Number of branches
     */
    count() {
        return this.findAll().length;
    }
}

// Singleton instance
// Tek bir instance oluşturarak her yerde aynı instance'ı kullanıyoruz
// Creating a single instance to use the same instance everywhere
const branchRepository = new BranchRepository();

module.exports = branchRepository;
