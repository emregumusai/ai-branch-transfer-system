// Gemini AI Service
// Gemini AI provider entegrasyonu
// Gemini AI provider integration

const axios = require('axios');
const { aiConfig } = require('../../config/ai.config');

/**
 * Gemini AI Service Class
 * Gemini API ile iletişim sağlar
 * Communicates with Gemini API
 */
class GeminiAIService {
    constructor() {
        const { apiKey, url, timeout, model } = aiConfig.gemini;
        this.apiKey = apiKey;
        this.url = url;
        this.timeout = timeout;
        this.model = model;
    }

    /**
     * Gemini AI'ya prompt gönderir ve yanıt alır
     * Sends prompt to Gemini AI and receives response
     * 
     * @param {string} prompt - AI'ya gönderilecek prompt / Prompt to send to AI
     * @returns {Promise<string>} - AI'dan dönen yanıt / Response from AI
     */
    async generateContent(prompt) {
        try {
            console.log('🚀 Gemini AI API\'ye istek gönderiliyor...');
            
            const response = await axios.post(
                this.url,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.apiKey
                    },
                    timeout: this.timeout
                }
            );

            const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            
            if (!reply) {
                throw new Error('Gemini AI returned empty response');
            }

            console.log('✅ Gemini AI\'dan yanıt alındı');
            console.log(`📝 Yanıt (ilk 100 karakter): ${reply.substring(0, 100)}...`);
            
            return reply;
        } catch (error) {
            console.error('❌ Gemini AI API Hatası:', error.message);
            
            if (error.response) {
                console.error('API Response Error:', error.response.data);
            }
            
            throw new Error(`Gemini AI API error: ${error.message}`);
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

module.exports = GeminiAIService;
