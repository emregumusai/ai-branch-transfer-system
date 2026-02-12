require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Orta katmanlarq
app.use(cors());
app.use(express.json());

// ROUTER'LARI EKLE
const geminiRouter = require('./routes/gemini');
const subelerRouter = require('./routes/subeler'); // Ekledik

app.use('/gemini', geminiRouter);   // Gemini endpoint'i
app.use('/subeler', subelerRouter); // Şubeler endpoint'i

// KULLANICI DOĞRULAMA
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

// ŞUBE GÜNCELLEME
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

// SUNUCUYU BAŞLAT
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
