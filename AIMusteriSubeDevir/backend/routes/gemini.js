// Gerekli kütüphaneleri (modülleri) projemize dahil ediyoruz.
const express = require("express"); // Node.js için web sunucusu ve API oluşturma çatısı.
const router = express.Router();    // Express'in, gelen istekleri belirli dosyalara yönlendirmesini sağlayan modülü.
const axios = require("axios");     // HTTP istekleri için axios kütüphanesi
const fs = require("fs");           // Sunucudaki dosya sistemine (dosya okuma/yazma) erişmemizi sağlayan Node.js modülü.
require("dotenv").config();         // .env dosyasındaki hassas bilgileri (API anahtarı gibi) güvenli bir şekilde yönetmemizi sağlar.

// ============================================
// AI PROVIDER YAPILANDIRMASI
// ============================================
// .env dosyasından AI_PROVIDER değerini okuyoruz: 'gemini' veya 'mistral'
const AI_PROVIDER = process.env.AI_PROVIDER || 'mistral';

// Gemini API Credentials
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Mistral AI Credentials
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

console.log(`🤖 AI Provider: ${AI_PROVIDER.toUpperCase()}`);

// İki coğrafi nokta arasındaki mesafeyi kilometre cinsinden hesaplar.
// Bu fonksiyon, "en yakın" şubeyi bulurken kullanılır.
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Dünya'nın ortalama yarıçapı (kilometre).
    const dLat = (lat2 - lat1) * Math.PI / 180; // Enlem farkını radyana çevir.
    const dLon = (lon2 - lon1) * Math.PI / 180; // Boylam farkını radyana çevir.
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Sonucu kilometre cinsinden döndür.
}

/**
 * Gemini AI'ya istek gönderir
 * @param {string} prompt - AI'ya gönderilecek prompt
 * @returns {Promise<string>} - AI'dan dönen yanıt
 */
async function callGeminiAPI(prompt) {
    const response = await axios.post(
        GEMINI_URL,
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
                'X-goog-api-key': GEMINI_API_KEY
            },
            timeout: 60000
        }
    );
    
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

/**
 * Mistral AI'ya istek gönderir
 * @param {string} prompt - AI'ya gönderilecek prompt
 * @returns {Promise<string>} - AI'dan dönen yanıt
 */
async function callMistralAPI(prompt) {
    const response = await axios.post(
        MISTRAL_URL,
        {
            model: "mistral-large-latest",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            timeout: 60000
        }
    );
    
    return response.data?.choices?.[0]?.message?.content?.trim();
}

/**
 * Seçilen AI provider'a göre istek gönderir
 * @param {string} prompt - AI'ya gönderilecek prompt
 * @returns {Promise<string>} - AI'dan dönen yanıt
 */
async function callAI(prompt) {
    console.log(`🚀 ${AI_PROVIDER.toUpperCase()} API'ye İstek Atılıyor...`);
    
    if (AI_PROVIDER === 'gemini') {
        return await callGeminiAPI(prompt);
    } else if (AI_PROVIDER === 'mistral') {
        return await callMistralAPI(prompt);
    } else {
        throw new Error(`Geçersiz AI Provider: ${AI_PROVIDER}. 'gemini' veya 'mistral' seçiniz.`);
    }
}

/**
 * Bir şubenin, verilen seçim kriterlerinden en az birine uyup uymadığını kontrol eder.
 * @param {object} sube - Kontrol edilecek şube objesi.
 * @param {string[]} secimler - Kullanıcının tercihleri.
 * @returns {boolean} - En az bir kritere uyuyorsa true, aksi takdirde false.
 */
function enAzBirKritereUyuyorMu(sube, secimler) {
    // Eğer kullanıcı hiç seçim yapmadıysa, tüm şubeler uygun kabul edilir.
    if (!secimler || secimler.length === 0) return true;
    // || (VEYA) operatörü sayesinde, koşullardan herhangi birinin doğru olması yeterlidir.
    return (
        (secimler.includes('ATM Yoğunluğu Düşük') && sube.atmSayisi <= 3) ||
        (secimler.includes('Engelli Erişimi Mevcut') && sube.erisilebilirlik === true) ||
        (secimler.includes('Şube Yoğunluğu Düşük') && sube.yogunluk === 'dusuk') ||
        (secimler.includes('Park Yeri Mevcut') && sube.parkYeri === true) ||
        (secimler.includes('Uzun Çalışma Saatleri') && sube.uzunCalismaSaatleri === true) ||
        (secimler.includes('Kolay Ulaşım') && sube.kolayUlasim === true) ||
        (secimler.includes('Bireysel Bankacılık Hizmeti') && sube.hizmetTurleri && sube.hizmetTurleri.includes('Bireysel')) ||
        (secimler.includes('Kurumsal Bankacılık Hizmeti') && sube.hizmetTurleri && sube.hizmetTurleri.includes('Kurumsal')) ||
        (secimler.includes('Kobi Bankacılığı Hizmeti') && sube.hizmetTurleri && sube.hizmetTurleri.includes('KOBİ'))
    );
}

/**
 * Bir şubenin, verilen seçim kriterlerinin tamamına uyup uymadığını kontrol eder.
 * @param {object} sube - Kontrol edilecek şube objesi.
 * @param {string[]} secimler - Kullanıcının tercihleri.
 * @returns {boolean} - Tüm kriterlere uyuyorsa true, aksi takdirde false.
 */
function tumKriterlereUyuyorMu(sube, secimler) {
    // Eğer kullanıcı hiç seçim yapmadıysa, tüm şubeler uygun kabul edilir.
    if (!secimler || secimler.length === 0) return true;
    // && (VE) operatörü sayesinde, tüm koşulların aynı anda doğru olması gerekir.
    // (!secimler.includes(...) || ...) yapısı şu anlama gelir:
    // "Eğer bu kriter seçilmemişse, bu koşulu geçmiş say (true). Eğer seçilmişse, o zaman şubenin özelliğinin de doğru olması gerekir."
    return (
        (!secimler.includes('ATM Yoğunluğu Düşük') || sube.atmSayisi <= 3) &&
        (!secimler.includes('Engelli Erişimi Mevcut') || sube.erisilebilirlik === true) &&
        (!secimler.includes('Şube Yoğunluğu Düşük') || sube.yogunluk === 'dusuk') &&
        (!secimler.includes('Park Yeri Mevcut') || sube.parkYeri === true) &&
        (!secimler.includes('Uzun Çalışma Saatleri') || sube.uzunCalismaSaatleri === true) &&
        (!secimler.includes('Kolay Ulaşım') || sube.kolayUlasim === true) &&
        (!secimler.includes('Bireysel Bankacılık Hizmeti') || (sube.hizmetTurleri && sube.hizmetTurleri.includes('Bireysel'))) &&
        (!secimler.includes('Kurumsal Bankacılık Hizmeti') || (sube.hizmetTurleri && sube.hizmetTurleri.includes('Kurumsal'))) &&
        (!secimler.includes('Kobi Bankacılığı Hizmeti') || (sube.hizmetTurleri && sube.hizmetTurleri.includes('KOBİ')))
    );
}


// Ana API endpoint'i. Uygulamamızın çekirdek mantığı burada yer alır.
// "/" adresine bir POST isteği geldiğinde bu blok çalışır.
// 'async' olması, içinde 'await' ile bekletilebilen işlemler (API isteği gibi) olduğunu belirtir.
router.post("/", async (req, res) => {
    // İstemciden (frontend'den) gönderilen JSON verisinin içinden il, konum ve seçimler bilgilerini alıyoruz.
    const { il, konum, secimler } = req.body;

    // Hata yönetimi için try-catch bloğu kullanıyoruz.
    // try içerisindeki kodda bir hata olursa program çökmez, catch bloğu çalışır.
    try {
        const currentApiKey = AI_PROVIDER === 'gemini' ? GEMINI_API_KEY : MISTRAL_API_KEY;
        console.log(`👉 1. ${AI_PROVIDER.toUpperCase()} API Anahtarı:`, currentApiKey ? "YÜKLÜ ✅" : "BULUNAMADI! ❌");
        
        // 'subeler.json' dosyasını senkron olarak oku, içeriğini utf-8 formatında metin olarak al ve JSON.parse ile JavaScript objesine çevir.
        const subeVerisi = JSON.parse(fs.readFileSync('subeler.json', 'utf-8'));
        const tumSubeler = subeVerisi.subeler; // JSON dosyasındaki "subeler" dizisini al.

        // Müşterinin şu anki şubesini, ismine göre tüm şubeler listesinden bul. Koordinatlarını almak için bu gerekli.
        const kullaniciSubesi = tumSubeler.find(s => s.isim === konum);
        
        console.log("👉 2. Kullanıcı Şubesi Bulundu mu?:", kullaniciSubesi ? `${kullaniciSubesi.isim} ✅` : "HAYIR! ❌");
        console.log("👉 3. İl:", il, "| Seçimler:", secimler.length, "adet");

        // Eğer müşterinin belirttiği mevcut şube verilerimizde bulunamazsa, 404 (Not Found) hatası döndür ve işlemi sonlandır.
        if (!kullaniciSubesi) {
            return res.status(404).json({ mesaj: 'Mevcut şube bulunamadı.' });
        }

        // --- EN YAKIN ŞUBE HESAPLAMASI (TERCİHLERDEN BAĞIMSIZ - TÜM ŞUBELER) ---
        const tumCografiSubeler = tumSubeler.filter(s =>
            (s.il === il || s.komsuIllerIcin === true) && s.isim !== konum
        );
        
        const enYakinTumSubelerden = tumCografiSubeler.map(s => ({
            ...s,
            mesafe: haversineDistance(
                kullaniciSubesi.koordinat.lat,
                kullaniciSubesi.koordinat.lon,
                s.koordinat.lat,
                s.koordinat.lon
            )
        })).sort((a, b) => a.mesafe - b.mesafe)[0];
        
        const enYakinSube = enYakinTumSubelerden ? enYakinTumSubelerden.isim : null;
        const enYakinMesafe = enYakinTumSubelerden ? enYakinTumSubelerden.mesafe : null;
        
        console.log(`📍 EN YAKIN ŞUBE (tüm şubeler arasından): ${enYakinSube} (${enYakinMesafe?.toFixed(1)} km)`);

        // --- AKILLI FİLTRELEME HUNİSİ BAŞLANGICI ---

        // 1. ADIM: Coğrafi Kapsamı Belirle
        // Sadece müşterinin bulunduğu ildeki VEYA komşu illere de hizmet veren şubeleri filtrele.
        // Ayrıca, müşterinin mevcut şubesini listeden çıkar.
        const cografiUygunSubeler = tumSubeler.filter(s =>
            (s.il === il || s.komsuIllerIcin === true) && s.isim !== konum
        );

        let adaylar;  // Gemini'ye gönderilecek nihai aday şubelerin listesi.
        let aciklama; // Önerinin neden yapıldığını açıklayan, bizim tarafımızdan oluşturulan standart metin.

        // 2. ADIM: Tam Eşleşenleri Bul
        // Coğrafi olarak uygun şubeler içinden, müşterinin TÜM tercihlerine uyanları bul.
        const tamEslestirenler = cografiUygunSubeler.filter(sube => tumKriterlereUyuyorMu(sube, secimler));

        if (tamEslestirenler.length > 0) {
            // Eğer tam eşleşen bir veya daha fazla şube varsa, aday listemiz bu şubelerden oluşur.
            adaylar = tamEslestirenler;
            aciklama = "Tüm tercihlerinize tam olarak uyan şubeler bulundu ve değerlendirmeye alındı.";
        } else {
            // 3. ADIM: Kısmi Eşleşenleri (En Az 1 Tane) Bul
            // Eğer tam eşleşen yoksa, bu sefer EN AZ BİR kritere uyan şubeleri ara.
            const kismiEslestirenler = cografiUygunSubeler.filter(sube => enAzBirKritereUyuyorMu(sube, secimler));

            if (kismiEslestirenler.length > 0) {
                // Eğer kısmi eşleşen şubeler varsa, aday listemiz bu şubelerden oluşur.
                adaylar = kismiEslestirenler;
                aciklama = "Tercihlerinize tam uyan şube bulunamadı, ancak en az bir kritere uyan şubeler öneri için değerlendiriliyor.";
            } else {
                // 4. ADIM: Son Çare (Hiçbir kritere uyan yoksa)
                // Eğer hiçbir kritere uyan şube yoksa, müşteriyi cevapsız bırakmamak için coğrafi olarak uygun tüm şubeleri aday olarak al.
                adaylar = cografiUygunSubeler;
                aciklama = "Tercihlerinize özel bir şube bulunamadı. Size en uygun olabilecek şubeyi belirlemek için bulunduğunuz il ve komşu illerdeki tüm şubeler değerlendiriliyor.";
            }
        }

        // --- AKILLI FİLTRELEME HUNİSİ SONU ---

        // ÖNCELİKLENDİRME: Mesafe ve tercih skoruna göre sırala
        const skorluAdaylar = adaylar.map(sube => {
            const mesafe = haversineDistance(
                kullaniciSubesi.koordinat.lat, 
                kullaniciSubesi.koordinat.lon,
                sube.koordinat.lat, 
                sube.koordinat.lon
            );
            
            // MÜKEMMEL OPTİMİZE EDİLMİŞ SKOR HESAPLAMA SİSTEMİ (0-100 arası)
            let skor = 0;
            
            // 1. MESAFE SKORU - Sürekli (Linear) Azalan Skor, Her KM Önemli - %30 ağırlık
            // 0 km = 30 puan, 50 km = 0 puan (linear interpolasyon)
            const maxMesafe = 50;
            const mesafePuani = mesafe <= maxMesafe ? 30 * (1 - (mesafe / maxMesafe)) : 0;
            skor += mesafePuani;
            
            // 2. TERCİH EŞLEŞME SKORU - Her kriterin eşit ağırlığı - %40 ağırlık
            const eslesenTercihSayisi = secimler.filter(tercih => {
                if (tercih === 'ATM Yoğunluğu Düşük' && sube.atmSayisi <= 3) return true;
                if (tercih === 'Engelli Erişimi Mevcut' && sube.erisilebilirlik) return true;
                if (tercih === 'Şube Yoğunluğu Düşük' && sube.yogunluk === 'dusuk') return true;
                if (tercih === 'Park Yeri Mevcut' && sube.parkYeri) return true;
                if (tercih === 'Uzun Çalışma Saatleri' && sube.uzunCalismaSaatleri) return true;
                if (tercih === 'Kolay Ulaşım' && sube.kolayUlasim) return true;
                if (tercih === 'Bireysel Bankacılık Hizmeti' && sube.hizmetTurleri && sube.hizmetTurleri.includes('Bireysel')) return true;
                if (tercih === 'Kurumsal Bankacılık Hizmeti' && sube.hizmetTurleri && sube.hizmetTurleri.includes('Kurumsal')) return true;
                if (tercih === 'Kobi Bankacılığı Hizmeti' && sube.hizmetTurleri && sube.hizmetTurleri.includes('KOBİ')) return true;
                return false;
            }).length;
            
            const tercihPuani = secimler.length > 0 ? (eslesenTercihSayisi / secimler.length) * 40 : 20;
            skor += tercihPuani;
            
            // 3. ÖNCELİK SIRASI BONUSU - Kademeli Azalan Bonus Puanları - %30 ağırlık
            // İlk seçimden son seçime doğru bonus puanları azalır
            let oncelikBonusu = 0;
            const oncelikBonuslari = [20, 15, 10, 7]; // 1., 2., 3., 4. tercih için bonus puanları
            
            secimler.forEach((tercih, index) => {
                let eslesmeVar = false;
                
                if (tercih === 'ATM Yoğunluğu Düşük' && sube.atmSayisi <= 3) eslesmeVar = true;
                if (tercih === 'Engelli Erişimi Mevcut' && sube.erisilebilirlik) eslesmeVar = true;
                if (tercih === 'Şube Yoğunluğu Düşük' && sube.yogunluk === 'dusuk') eslesmeVar = true;
                if (tercih === 'Park Yeri Mevcut' && sube.parkYeri) eslesmeVar = true;
                if (tercih === 'Uzun Çalışma Saatleri' && sube.uzunCalismaSaatleri) eslesmeVar = true;
                if (tercih === 'Kolay Ulaşım' && sube.kolayUlasim) eslesmeVar = true;
                if (tercih === 'Bireysel Bankacılık Hizmeti' && sube.hizmetTurleri && sube.hizmetTurleri.includes('Bireysel')) eslesmeVar = true;
                if (tercih === 'Kurumsal Bankacılık Hizmeti' && sube.hizmetTurleri && sube.hizmetTurleri.includes('Kurumsal')) eslesmeVar = true;
                if (tercih === 'Kobi Bankacılığı Hizmeti' && sube.hizmetTurleri && sube.hizmetTurleri.includes('KOBİ')) eslesmeVar = true;
                
                if (eslesmeVar && index < oncelikBonuslari.length) {
                    oncelikBonusu += oncelikBonuslari[index];
                }
            });
            
            skor += oncelikBonusu;
            
            return { 
                ...sube, 
                mesafe, 
                skor,
                skorDetay: {
                    mesafePuani: mesafePuani.toFixed(1),
                    tercihPuani: tercihPuani.toFixed(1),
                    oncelikBonusu: oncelikBonusu.toFixed(1)
                }
            };
        });

        // Skora göre sırala (en yüksek skor önce)
        // Beraberlik durumunda mesafeye göre sırala (yakın olan kazanır)
        skorluAdaylar.sort((a, b) => {
            const skorFarki = b.skor - a.skor;
            // Eğer skorlar çok yakınsa (0.5 puan farktan az), mesafeye göre karar ver
            if (Math.abs(skorFarki) < 0.5) {
                return a.mesafe - b.mesafe;
            }
            return skorFarki;
        });

        // EN İYİ 5 ŞUBE'Yİ SEÇ
        adaylar = skorluAdaylar.slice(0, 5);

        console.log("👉 4. Aday Şube Sayısı:", adaylar.length);
        console.log("📊 Skor Dağılımı (Mesafe + Tercih + Öncelik Bonusu):");
        adaylar.forEach(s => {
            console.log(`   ${s.isim}: ${s.skor.toFixed(1)} puan (Mesafe: ${s.skorDetay.mesafePuani}p, Tercih: ${s.skorDetay.tercihPuani}p, Öncelik: ${s.skorDetay.oncelikBonusu}p) - ${s.mesafe.toFixed(1)}km`);
        });
        
        // Adaylar içindeki en yakın şubeyi bul
        const adayIcindeEnYakin = adaylar.length > 0 ? adaylar.reduce((enYakin, sube) => 
            sube.mesafe < enYakin.mesafe ? sube : enYakin
        ) : null;
        
        if (adayIcindeEnYakin) {
            console.log(`🎯 Adaylar içinde en yakın: ${adayIcindeEnYakin.isim} (${adayIcindeEnYakin.mesafe.toFixed(1)} km)`);
        }

        // AI'ye gönderilecek şube listesini ZENGİNLEŞTİRİLMİŞ FORMATTA hazırlıyoruz
        const promptAdayMetni = adaylar.map((s, i) =>
            `${i + 1}. ${s.isim}
   - Lokasyon: ${s.il} / ${s.ilce}
   - Mesafe: ${s.mesafe.toFixed(1)} km
   - Tip: ${s.tip}
   - Hizmet Türleri: ${s.hizmetTurleri.join(', ')}
   - Özellikler:
     * ATM Sayısı: ${s.atmSayisi}
     * Yoğunluk: ${s.yogunluk}
     * Erişilebilirlik: ${s.erisilebilirlik ? 'Var' : 'Yok'}
     * Park Yeri: ${s.parkYeri ? 'Var' : 'Yok'}
     * Uzun Çalışma Saatleri: ${s.uzunCalismaSaatleri ? 'Var' : 'Yok'}
     * Kolay Ulaşım: ${s.kolayUlasim ? 'Var' : 'Yok'}
   - Uygunluk Skoru: ${s.skor.toFixed(1)}/100 (Mesafe: ${s.skorDetay.mesafePuani}, Tercih: ${s.skorDetay.tercihPuani}, Öncelik Bonusu: ${s.skorDetay.oncelikBonusu})`
        ).join("\n\n");

        // Yapay zekaya göndereceğimiz komut metnini (prompt) oluşturuyoruz.
        // Bu, yapay zekadan ne istediğimizi net bir şekilde belirttiğimiz kısımdır.
        const prompt = `
## MÜŞTERİ PROFİLİ
- Mevcut Şube: ${konum}
- Lokasyon: ${il} / ${kullaniciSubesi.ilce}
- Koordinatlar: ${kullaniciSubesi.koordinat.lat}, ${kullaniciSubesi.koordinat.lon}

## ⭐ TERCİH ÖNCELİK SIRALAMASI (Yukarıdan aşağıya önem sırası)
${secimler.length > 0 ? secimler.map((t, i) => {
    const oncelikEtiketi = ['🥇 1. ÖNCELİK', '🥈 2. ÖNCELİK', '🥉 3. ÖNCELİK', '4. ÖNCELİK'];
    return `${oncelikEtiketi[i] || `${i + 1}. ÖNCELİK`}: ${t}`;
}).join('\n') : 'Kullanıcı özel tercih belirtmedi (tüm şubeler eşit değerlendirilecek)'}

## EN UYGUN 5 ADAY ŞUBE (Tercih filtreleme ve skorlamaya göre seçilmiş)
${promptAdayMetni}

⚠️ **ÖNEMLİ NOT:** Yukarıdaki 5 şube, tüm şubeler arasından müşteri tercihlerine göre filtrelenerek seçilmiştir. Daha fazla şube var ancak bunlar tercihlere uygun değil. Bu 5 aday içinde en yakın: **${adayIcindeEnYakin?.isim || 'Belirsiz'}** (${adayIcindeEnYakin?.mesafe.toFixed(1) || '?'} km)

## 🎯 GÖREV
Yukarıdaki **5 ADAY** arasından (tüm şubeler değil!), müşterinin **TERCİH ÖNCELİK SIRALAMASI**'na göre **EN UYGUN TEK BİR** şubeyi seç.

### ⚠️ KRİTİK KURALLAR:
1. **1. ÖNCELİK (🥇) EN ÖNEMLİDİR**: Müşterinin birinci tercihi mutlaka ön planda tutulmalıdır
2. **ÖNCELİK SIRASI HAYATİDİR**: İkinci, üçüncü ve dördüncü tercihler de sırasıyla değerlendirilmelidir
3. **MESAFE BİR FAKTÖRDÜR AMA TEK FAKTÖR DEĞİLDİR**: Çok uzak (>30km) şubeler dezavantajlı AMA yakın olmak tek başına yeterli değil
4. **SKOR BİR REHBERDİR**: Uygunluk skorları iyi bir başlangıç noktasıdır ama kendi analizini mutlaka yap
5. **DENGELİ DEĞERLENDİRME**: Öncelikler + Mesafe + Hizmet Türleri üçgeninde en dengeli çözümü bul

### ⚠️ CEVAP FORMATI (KATIYETLE UYULMASI GEREKEN):
ŞUBE_ADI
AÇIKLAMA: [SADECE 1 KISA CÜMLE - Maksimum 15-20 kelime - Hangi önceliği karşılıyor kısaca belirt. "Tek şube" gibi ifadeler KULLANMA]

ÖRNEK:
Kadıköy Şubesi
AÇIKLAMA: En önemli tercihleriniz olan park yeri ve düşük yoğunluk mevcut, ayrıca adaylar içinde en yakın.
        `;

        console.log("👉 5. AI API'ye İstek Atılıyor... 🚀");
        
        // Seçilen AI provider'a istek gönder
        const replyRaw = await callAI(prompt);
        
        console.log(`👉 6. ${AI_PROVIDER.toUpperCase()} API'den Yanıt Başarıyla Geldi! ✅`);
        console.log(`📝 ${AI_PROVIDER.toUpperCase()} Yanıtı (ilk 100 karakter):`, replyRaw?.substring(0, 100) + "...");

        // Eğer yapay zekadan bir cevap alınamadıysa, 500 (Internal Server Error) hatası döndür.
        if (!replyRaw) {
            console.log("❌ AI yanıtı boş!");
            return res.status(500).json({ mesaj: "Yapay zekâ yanıtı alınamadı." });
        }

        // BOLD İŞARETLERİNİ TEMİZLE (**, * karakterlerini kaldır)
        // Mistral AI ve Gemini bazen markdown formatında cevap verebilir
        const cleanedReply = replyRaw.replace(/\*\*/g, '').replace(/\*/g, '');

        // Yapay zekanın cevabını, belirlediğimiz "AÇIKLAMA:" delimiter'ına göre bölerek şube adını ve açıklama metnini ayırıyoruz.
        const [oneri, ...aciklamaArr] = cleanedReply.split(/\s*AÇIKLAMA:\s*/i);
        const aciklamaGemini = aciklamaArr.join(" ").trim();

        console.log("👉 7. Başarılı Yanıt Gönderiliyor:", oneri.trim());
        
        // Sonucu istemciye (frontend'e) JSON formatında gönderiyoruz.
        res.json({
            oneri: oneri.trim(), // Gemini AI'nin önerdiği şube adı.
            aciklama: aciklamaGemini || aciklama, // Eğer Gemini bir açıklama göndermezse, bizim oluşturduğumuz standart açıklamayı kullan.
            enYakin: enYakinSube // Sadece mesafeye göre en yakın olan şube.
        });

    } catch (error) {
        // 'try' bloğunda herhangi bir hata olursa (örn: API'ye ulaşılamadı, dosya okunamadı), bu blok çalışır.
        console.log("\n❌❌❌ KRİTİK HATA BURADA PATLADI: ❌❌❌");
        console.error("Hata Mesajı:", error.message);
        console.error("Hata Tipi:", error.constructor.name);
        console.error("Tam Hata Detayı:", error);
        if (error.response) {
            console.error("API Yanıt Hatası:", error.response.data);
        }
        console.log("❌❌❌ HATA DETAYI BİTTİ ❌❌❌\n");
        
        // FALLBACK: API hatası durumunda mock response (geliştirme/test için)
        console.warn("⚠️ API hatası - Mock response döndürülüyor (TEST MODU)");
        
        try {
            // En yakın şubeyi hesapla (API olmadan da çalışabilir)
            const subeVerisi = JSON.parse(fs.readFileSync('subeler.json', 'utf-8'));
            const tumSubeler = subeVerisi.subeler;
            const kullaniciSubesi = tumSubeler.find(s => s.isim === req.body.konum);
            
            if (kullaniciSubesi) {
                const cografiUygunSubeler = tumSubeler.filter(s =>
                    (s.il === req.body.il || s.komsuIllerIcin === true) && s.isim !== req.body.konum
                );
                
                let minMesafe = Infinity;
                let enYakinSube = null;
                cografiUygunSubeler.forEach((sube) => {
                    const mesafe = haversineDistance(
                        kullaniciSubesi.koordinat.lat, kullaniciSubesi.koordinat.lon,
                        sube.koordinat.lat, sube.koordinat.lon
                    );
                    if (mesafe < minMesafe) {
                        minMesafe = mesafe;
                        enYakinSube = sube.isim;
                    }
                });
                
                // Mock AI response döndür
                return res.json({
                    oneri: enYakinSube || "Merkez Şube",
                    aciklama: "⚠️ TEST MODU: Bu mesafe tabanlı otomatik öneridir. Yapay zeka önerileri için Gemini API hatası oluştu.",
                    enYakin: enYakinSube || "Merkez Şube"
                });
            }
        } catch (fallbackError) {
            console.error("Fallback hatası:", fallbackError.message);
        }
        
        // Eğer hiçbir şey bulunamazsa genel hata mesajı
        res.status(500).json({ mesaj: "Sunucu tarafında bir hata oluştu. API çağrısı başarısız." });
    }
});

// Bu router'ı, projenin ana dosyası (genellikle app.js veya server.js) tarafından kullanılabilir hale getiriyoruz.
module.exports = router;