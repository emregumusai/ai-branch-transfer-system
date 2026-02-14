// Branch Recommendation Validator
// Şube öneri request validation
// Branch recommendation request validation

const { CRITERIA_TYPES } = require('../constants/criteria.constants');

/**
 * Branch Recommendation Validator
 * Şube öneri request'lerini validate eder
 * Validates branch recommendation requests
 */
class BranchRecommendationValidator {
    /**
     * Request body'yi validate eder
     * Validates request body
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    validate(req, res, next) {
        const { il, konum, secimler } = req.body;

        // 1. Zorunlu alanların kontrolü
        // Check required fields
        if (!il || typeof il !== 'string' || il.trim() === '') {
            return res.status(400).json({
                mesaj: 'Geçersiz istek: "il" alanı zorunludur ve boş olamaz.',
                hata: 'MISSING_OR_INVALID_CITY'
            });
        }

        if (!konum || typeof konum !== 'string' || konum.trim() === '') {
            return res.status(400).json({
                mesaj: 'Geçersiz istek: "konum" alanı zorunludur ve boş olamaz.',
                hata: 'MISSING_OR_INVALID_LOCATION'
            });
        }

        // 2. Secimler array kontrolü
        // Check secimler array
        if (!secimler) {
            // Secimler optional, boş array olarak ayarla
            // Secimler is optional, set as empty array
            req.body.secimler = [];
        } else if (!Array.isArray(secimler)) {
            return res.status(400).json({
                mesaj: 'Geçersiz istek: "secimler" bir dizi (array) olmalıdır.',
                hata: 'INVALID_SECIMLER_TYPE'
            });
        }

        // 3. Secimler içeriğinin kontrolü
        // Validate secimler content
        const validCriteriaValues = Object.values(CRITERIA_TYPES);
        
        for (const secim of req.body.secimler) {
            if (typeof secim !== 'string') {
                return res.status(400).json({
                    mesaj: 'Geçersiz istek: "secimler" dizisindeki her eleman string olmalıdır.',
                    hata: 'INVALID_SECIM_TYPE'
                });
            }

            if (!validCriteriaValues.includes(secim)) {
                return res.status(400).json({
                    mesaj: `Geçersiz tercih: "${secim}". Geçerli tercihler: ${validCriteriaValues.join(', ')}`,
                    hata: 'INVALID_CRITERIA_VALUE',
                    gecersizTercih: secim
                });
            }
        }

        // 4. Aynı tercih birden fazla kez seçilmiş mi?
        // Check for duplicate criteria
        const uniqueSecimler = new Set(req.body.secimler);
        if (uniqueSecimler.size !== req.body.secimler.length) {
            return res.status(400).json({
                mesaj: 'Geçersiz istek: Aynı tercih birden fazla kez seçilemez.',
                hata: 'DUPLICATE_CRITERIA'
            });
        }

        // Validation başarılı, devam et
        // Validation successful, continue
        next();
    }

    /**
     * Request body'yi sanitize eder (temizler)
     * Sanitizes request body
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    sanitize(req, res, next) {
        const { il, konum, secimler } = req.body;

        // String alanları trim et
        // Trim string fields
        req.body.il = il.trim();
        req.body.konum = konum.trim();

        // Secimler array'ini trim et
        // Trim secimler array
        if (Array.isArray(secimler)) {
            req.body.secimler = secimler.map(s => s.trim());
        }

        next();
    }
}

// Singleton instance
const branchRecommendationValidator = new BranchRecommendationValidator();

module.exports = branchRecommendationValidator;
