// Express Application Entry Point
// Express uygulaması giriş noktası
// Main application file for AI-Powered Customer Branch Transfer System

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Middlewares
const { requestLogger } = require('./src/middlewares/logger.middleware');
const { errorHandler, notFoundHandler } = require('./src/middlewares/error-handler.middleware');

// Config
const { validateAIConfig } = require('./src/config/ai.config');

// Routes
const recommendationRoutes = require('./src/routes/recommendation.routes');
const subelerRouter = require('./routes/subeler');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS - Cross-Origin Resource Sharing
app.use(cors());

// Body Parser - JSON request body parsing
app.use(express.json());

// Request Logger - Log all incoming requests
app.use(requestLogger);

// ============================================
// CONFIGURATION VALIDATION
// ============================================

// Validate AI provider configuration on startup
try {
    validateAIConfig();
    console.log('✅ AI Configuration validated successfully');
} catch (error) {
    console.error('❌ AI Configuration Error:', error.message);
    process.exit(1);
}

// ============================================
// API ROUTES
// ============================================

// Branch Recommendation (NEW - Clean Architecture)
// Şube öneri endpoint'i (YENİ - Temiz Mimari)
app.use('/gemini', recommendationRoutes);

// Branches List (Legacy - will be refactored)
// Şube listesi (Eski - refactor edilecek)
app.use('/subeler', subelerRouter);

// User Authentication (Legacy - will be moved to auth controller)
// Kullanıcı doğrulama (Eski - auth controller'a taşınacak)
app.post('/giris', (req, res) => {
    const { girisBilgisi } = req.body;
    const veriler = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));

    const kullanici = veriler.find(
        (k) =>
            k.tc === girisBilgisi ||
            k.kullaniciAdi.toLowerCase() === girisBilgisi.toLowerCase()
    );

    if (kullanici) {
        res.json({
            basarili: true,
            adSoyad: kullanici.adSoyad,
            sube: kullanici.sube
        });
    } else {
        res.json({ basarili: false, mesaj: 'Kullanıcı bulunamadı' });
    }
});

// Branch Update (Legacy - will be moved to branch controller)
// Şube güncelleme (Eski - branch controller'a taşınacak)
app.post('/sube-guncelle', (req, res) => {
    const { girisBilgisi, yeniSube } = req.body;
    const dosyaYolu = path.join(__dirname, 'users.json');

    const veriler = JSON.parse(fs.readFileSync(dosyaYolu, 'utf-8'));

    const kullaniciIndex = veriler.findIndex(
        (k) =>
            k.tc === girisBilgisi ||
            k.kullaniciAdi.toLowerCase() === girisBilgisi.toLowerCase()
    );

    if (kullaniciIndex !== -1) {
        veriler[kullaniciIndex].sube = yeniSube;
        fs.writeFileSync(dosyaYolu, JSON.stringify(veriler, null, 2));
        res.json({ basarili: true, mesaj: 'Şube başarıyla güncellendi.' });
    } else {
        res.status(404).json({ basarili: false, mesaj: 'Kullanıcı bulunamadı.' });
    }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Not Found Handler (must be after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 AI-Powered Customer Branch Transfer System');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'mistral'}`);
    console.log('='.repeat(50) + '\n');
});
