// Database Configuration
// Veritabanı ayarları (JSON dosya yolları)
// Database settings (JSON file paths)

const path = require('path');

/**
 * JSON dosya tabanlı veritabanı yapılandırması
 * JSON file-based database configuration
 */
const databaseConfig = {
    // Şubeler JSON dosyası yolu
    // Branches JSON file path
    branchesPath: path.join(__dirname, '../../subeler.json'),
    
    // Kullanıcılar JSON dosyası yolu
    // Users JSON file path
    usersPath: path.join(__dirname, '../../users.json'),
    
    // Encoding formatı
    // Encoding format
    encoding: 'utf-8'
};

module.exports = {
    databaseConfig
};
