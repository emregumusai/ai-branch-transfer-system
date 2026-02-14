// AI Configuration
// Yapay zeka provider ayarları ve API bilgileri
// AI provider settings and API credentials

require('dotenv').config();

/**
 * AI Provider Configuration
 * Desteklenen provider'lar: 'gemini', 'mistral'
 * Supported providers: 'gemini', 'mistral'
 */
const aiConfig = {
    // Aktif AI provider (AI_PROVIDER environment variable'dan okunur)
    // Active AI provider (read from AI_PROVIDER environment variable)
    provider: process.env.AI_PROVIDER || 'mistral',
    
    // Gemini AI Configuration
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        timeout: 60000, // 60 seconds
        model: 'gemini-2.0-flash'
    },
    
    // Mistral AI Configuration
    mistral: {
        apiKey: process.env.MISTRAL_API_KEY,
        url: 'https://api.mistral.ai/v1/chat/completions',
        timeout: 60000, // 60 seconds
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 1000
    }
};

/**
 * AI Provider'ın yapılandırmasını validate eder
 * Validates AI provider configuration
 * 
 * @throws {Error} - Geçersiz yapılandırma durumunda hata fırlatır
 */
function validateAIConfig() {
    const { provider, gemini, mistral } = aiConfig;
    
    if (!['gemini', 'mistral'].includes(provider)) {
        throw new Error(`Invalid AI Provider: ${provider}. Choose 'gemini' or 'mistral'.`);
    }
    
    if (provider === 'gemini' && !gemini.apiKey) {
        throw new Error('Gemini API key is missing. Please set GEMINI_API_KEY in .env file.');
    }
    
    if (provider === 'mistral' && !mistral.apiKey) {
        throw new Error('Mistral API key is missing. Please set MISTRAL_API_KEY in .env file.');
    }
    
    console.log(`🤖 AI Provider: ${provider.toUpperCase()} ✅`);
}

module.exports = {
    aiConfig,
    validateAIConfig
};
