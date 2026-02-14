// Criteria Constants
// Şube seçim kriterleri sabitleri
// Branch selection criteria constants

/**
 * Müşteri tercihleri (kullanıcı arayüzünde gösterilen seçenekler)
 * Customer preferences (options shown in user interface)
 */
const CRITERIA_TYPES = {
    ATM_LOW_DENSITY: 'ATM Yoğunluğu Düşük',
    ACCESSIBILITY: 'Engelli Erişimi Mevcut',
    BRANCH_LOW_DENSITY: 'Şube Yoğunluğu Düşük',
    PARKING: 'Park Yeri Mevcut',
    EXTENDED_HOURS: 'Uzun Çalışma Saatleri',
    EASY_ACCESS: 'Kolay Ulaşım',
    INDIVIDUAL_BANKING: 'Bireysel Bankacılık Hizmeti',
    CORPORATE_BANKING: 'Kurumsal Bankacılık Hizmeti',
    SME_BANKING: 'Kobi Bankacılığı Hizmeti'
};

/**
 * Kriterlerin şube özellikleriyle eşleşme kuralları
 * Criteria matching rules with branch properties
 */
const CRITERIA_MAPPINGS = {
    [CRITERIA_TYPES.ATM_LOW_DENSITY]: (branch) => branch.atmSayisi <= 3,
    [CRITERIA_TYPES.ACCESSIBILITY]: (branch) => branch.erisilebilirlik === true,
    [CRITERIA_TYPES.BRANCH_LOW_DENSITY]: (branch) => branch.yogunluk === 'dusuk',
    [CRITERIA_TYPES.PARKING]: (branch) => branch.parkYeri === true,
    [CRITERIA_TYPES.EXTENDED_HOURS]: (branch) => branch.uzunCalismaSaatleri === true,
    [CRITERIA_TYPES.EASY_ACCESS]: (branch) => branch.kolayUlasim === true,
    [CRITERIA_TYPES.INDIVIDUAL_BANKING]: (branch) => 
        branch.hizmetTurleri && branch.hizmetTurleri.includes('Bireysel'),
    [CRITERIA_TYPES.CORPORATE_BANKING]: (branch) => 
        branch.hizmetTurleri && branch.hizmetTurleri.includes('Kurumsal'),
    [CRITERIA_TYPES.SME_BANKING]: (branch) => 
        branch.hizmetTurleri && branch.hizmetTurleri.includes('KOBİ')
};

/**
 * ATM yoğunluğu eşiği
 * ATM density threshold
 */
const ATM_THRESHOLD = 3;

/**
 * Yoğunluk seviyeleri
 * Density levels
 */
const DENSITY_LEVELS = {
    LOW: 'dusuk',
    MEDIUM: 'orta',
    HIGH: 'yuksek'
};

module.exports = {
    CRITERIA_TYPES,
    CRITERIA_MAPPINGS,
    ATM_THRESHOLD,
    DENSITY_LEVELS
};
