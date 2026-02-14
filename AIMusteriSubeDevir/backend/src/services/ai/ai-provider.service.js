// AI Provider Service (Strategy Pattern)
// AI provider seçimi ve yönetimi
// AI provider selection and management

const GeminiAIService = require('./gemini.service');
const MistralAIService = require('./mistral.service');
const { aiConfig } = require('../../config/ai.config');

/**
 * AI Provider Service
 * Strategy Pattern kullanarak aktif AI provider'ı yönetir
 * Manages active AI provider using Strategy Pattern
 */
class AIProviderService {
    constructor() {
        this.provider = aiConfig.provider;
        this.geminiService = new GeminiAIService();
        this.mistralService = new MistralAIService();
    }

    /**
     * Aktif AI provider'a göre içerik üretir
     * Generates content using active AI provider
     * 
     * @param {string} prompt - AI'ya gönderilecek prompt / Prompt to send to AI
     * @returns {Promise<string>} - AI'dan dönen yanıt / Response from AI
     */
    async generateContent(prompt) {
        console.log(`🤖 Using AI Provider: ${this.provider.toUpperCase()}`);
        
        if (this.provider === 'gemini') {
            return await this.geminiService.generateContent(prompt);
        } else if (this.provider === 'mistral') {
            return await this.mistralService.generateContent(prompt);
        } else {
            throw new Error(`Invalid AI Provider: ${this.provider}. Choose 'gemini' or 'mistral'.`);
        }
    }

    /**
     * AI provider'ı değiştirir (runtime'da)
     * Changes AI provider (at runtime)
     * 
     * @param {string} newProvider - Yeni provider adı / New provider name ('gemini' or 'mistral')
     */
    setProvider(newProvider) {
        if (!['gemini', 'mistral'].includes(newProvider)) {
            throw new Error(`Invalid AI Provider: ${newProvider}. Choose 'gemini' or 'mistral'.`);
        }
        
        this.provider = newProvider;
        console.log(`✅ AI Provider changed to: ${newProvider.toUpperCase()}`);
    }

    /**
     * Aktif provider'ı döndürür
     * Returns active provider
     * 
     * @returns {string} - Provider adı / Provider name
     */
    getActiveProvider() {
        return this.provider;
    }

    /**
     * Tüm provider'ların bağlantısını test eder
     * Tests connection of all providers
     * 
     * @returns {Promise<Object>} - Test sonuçları / Test results
     */
    async testAllProviders() {
        const results = {
            gemini: await this.geminiService.testConnection(),
            mistral: await this.mistralService.testConnection()
        };
        
        console.log('🧪 AI Provider Test Results:', results);
        return results;
    }
}

// Singleton instance
const aiProviderService = new AIProviderService();

module.exports = aiProviderService;
