// Mistral AI Service
// Mistral AI provider entegrasyonu
// Mistral AI provider integration

const axios = require('axios');
const { aiConfig } = require('../../config/ai.config');

/**
 * Mistral AI Service Class
 * Mistral API ile iletişim sağlar
 * Communicates with Mistral API
 */
class MistralAIService {
    constructor() {
        const { apiKey, url, timeout, model, temperature, maxTokens } = aiConfig.mistral;
        this.apiKey = apiKey;
        this.url = url;
        this.timeout = timeout;
        this.model = model;
        this.temperature = temperature;
        this.maxTokens = maxTokens;
    }

    /**
     * Mistral AI'ya prompt gönderir ve yanıt alır
     * Sends prompt to Mistral AI and receives response
     * 
     * @param {string} prompt - AI'ya gönderilecek prompt / Prompt to send to AI
     * @returns {Promise<string>} - AI'dan dönen yanıt / Response from AI
     */
    async generateContent(prompt) {
        try {
            console.log('🚀 Mistral AI API\'ye istek gönderiliyor...');
            
            const response = await axios.post(
                this.url,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: this.temperature,
                    max_tokens: this.maxTokens
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    timeout: this.timeout
                }
            );

            const reply = response.data?.choices?.[0]?.message?.content?.trim();
            
            if (!reply) {
                throw new Error('Mistral AI returned empty response');
            }

            console.log('✅ Mistral AI\'dan yanıt alındı');
            console.log(`📝 Yanıt (ilk 100 karakter): ${reply.substring(0, 100)}...`);
            
            return reply;
        } catch (error) {
            console.error('❌ Mistral AI API Hatası:', error.message);
            
            if (error.response) {
                console.error('API Response Error:', error.response.data);
            }
            
            throw new Error(`Mistral AI API error: ${error.message}`);
        }
    }

    /**
     * API bağlantısını test eder
     * Tests API connection
     * 
     * @returns {Promise<boolean>} - Bağlantı başarılı ise true / True if connection successful
     */
    async testConnection() {
        try {
            await this.generateContent('Test prompt');
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = MistralAIService;
