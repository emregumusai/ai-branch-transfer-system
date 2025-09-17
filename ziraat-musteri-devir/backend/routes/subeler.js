const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Tüm şubeleri döndür
router.get('/', (req, res) => {
    try {
        // Dosya yolu backend/subeler.json olacak şekilde ayarlandı
        const dosyaYolu = path.join(__dirname, '..', 'subeler.json');
        const data = fs.readFileSync(dosyaYolu, 'utf-8');
        const subeler = JSON.parse(data).subeler;
        res.json({ subeler }); // >>> DİKKAT: obje içinde array döndürüyoruz!
    } catch (error) {
        console.error('Şube verisi okunamadı:', error);
        res.status(500).json({ mesaj: 'Şube verisi okunamadı.' });
    }
});

module.exports = router;
