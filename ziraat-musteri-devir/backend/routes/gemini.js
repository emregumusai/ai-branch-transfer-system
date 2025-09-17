// Gerekli kütüphaneleri (modülleri) projemize dahil ediyoruz.
const express = require("express"); // Node.js için web sunucusu ve API oluşturma çatısı.
const router = express.Router();    // Express'in, gelen istekleri belirli dosyalara yönlendirmesini sağlayan modülü.
const axios = require("axios");     // Dış API'lere (bizim durumumuzda Google Gemini) HTTP istekleri yapmak için kullanılan kütüphane.
const fs = require("fs");           // Sunucudaki dosya sistemine (dosya okuma/yazma) erişmemizi sağlayan Node.js modülü.
require("dotenv").config();         // .env dosyasındaki hassas bilgileri (API anahtarı gibi) güvenli bir şekilde yönetmemizi sağlar.

// .env dosyasından okuduğumuz Gemini API anahtarını bir değişkene atıyoruz.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Gemini API'nin istek atacağımız tam URL adresini, API anahtarımızı da ekleyerek oluşturuyoruz.
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

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
        (secimler.includes('ATM Yoğunluğu Az') && sube.atmSayisi <= 3) ||
        (secimler.includes('Engelli Erişimi Var') && sube.erisilebilirlik === true) ||
        (secimler.includes('Yoğunluk Düşük') && sube.yogunluk === 'dusuk') ||
        (secimler.includes('Park Yeri Mevcut') && sube.parkYeri === true) ||
        (secimler.includes('Uzun Çalışma Saatleri') && sube.uzunCalismaSaatleri === true) ||
        (secimler.includes('Kolay Ulaşım') && sube.kolayUlasim === true)
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
        (!secimler.includes('ATM Yoğunluğu Az') || sube.atmSayisi <= 3) &&
        (!secimler.includes('Engelli Erişimi Var') || sube.erisilebilirlik === true) &&
        (!secimler.includes('Yoğunluk Düşük') || sube.yogunluk === 'dusuk') &&
        (!secimler.includes('Park Yeri Mevcut') || sube.parkYeri === true) &&
        (!secimler.includes('Uzun Çalışma Saatleri') || sube.uzunCalismaSaatleri === true) &&
        (!secimler.includes('Kolay Ulaşım') || sube.kolayUlasim === true)
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
        // 'subeler.json' dosyasını senkron olarak oku, içeriğini utf-8 formatında metin olarak al ve JSON.parse ile JavaScript objesine çevir.
        const subeVerisi = JSON.parse(fs.readFileSync('subeler.json', 'utf-8'));
        const tumSubeler = subeVerisi.subeler; // JSON dosyasındaki "subeler" dizisini al.

        // Müşterinin şu anki şubesini, ismine göre tüm şubeler listesinden bul. Koordinatlarını almak için bu gerekli.
        const kullaniciSubesi = tumSubeler.find(s => s.isim === konum);

        // Eğer müşterinin belirttiği mevcut şube verilerimizde bulunamazsa, 404 (Not Found) hatası döndür ve işlemi sonlandır.
        if (!kullaniciSubesi) {
            return res.status(404).json({ mesaj: 'Mevcut şube bulunamadı.' });
        }

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

        // Gemini'ye gönderilecek şube listesini okunabilir bir metne çeviriyoruz.
        const promptAdayMetni = adaylar.map((s, i) =>
            `${i + 1}. ${s.isim} | ATM: ${s.atmSayisi} | Erişilebilirlik: ${s.erisilebilirlik ? 'Var' : 'Yok'} | Yoğunluk: ${s.yogunluk} | Park Yeri: ${s.parkYeri ? 'Var' : 'Yok'} | Uzun Çalışma: ${s.uzunCalismaSaatleri ? 'Var' : 'Yok'} | Kolay Ulaşım: ${s.kolayUlasim ? 'Var' : 'Yok'}`
        ).join("\n"); // Her şubeyi yeni bir satıra yaz.

        // Yapay zekaya (Gemini) göndereceğimiz komut metnini (prompt) oluşturuyoruz.
        // Bu, yapay zekadan ne istediğimizi net bir şekilde belirttiğimiz kısımdır.
        const prompt = `
            Bir banka müşterisinin mevcut şubesi: ${konum}. Müşterinin bulunduğu il: ${il}.
            Müşterinin yeni bir şube için tercihleri önem sırasına göre şunlardır:
            ${secimler.map((t, i) => `${i + 1}. ${t}`).join('\n')}

            Aşağıdaki "Aday Şube Listesi" içinden, müşterinin tercihlerini ve mevcut şubesine olan mesafeyi göz önünde bulundurarak EN UYGUN tek bir şubeyi seç ve nedenini açıkla.

            Aday Şube Listesi:
            ${promptAdayMetni}

            Cevabın SADECE şu formatta olmalı, başka hiçbir şey ekleme:
            ŞUBE_ADI
            AÇIKLAMA: (Neden bu şubeyi önerdin? Hangi önemli tercihlere uyuyor? Mesafeyi nasıl dikkate aldın? Kısa ve net ol, en fazla 2-3 cümle.)
        `;

        // Hazırladığımız prompt'u ve veri yapısını axios ile Gemini API'ye POST isteği olarak gönderiyoruz.
        // 'await' sayesinde, API'den cevap gelene kadar kodun çalışması burada bekler.
        const response = await axios.post(
            GEMINI_URL,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        // Gemini'den gelen cevabın içindeki asıl metin kısmına güvenli bir şekilde erişiyoruz.
        // ?. (optional chaining) operatörü, eğer bir ara değer (örn: candidates) yoksa hata vermek yerine undefined döndürür.
        const replyRaw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        // Eğer yapay zekadan bir cevap alınamadıysa, 500 (Internal Server Error) hatası döndür.
        if (!replyRaw) {
            return res.status(500).json({ mesaj: "Yapay zekâ yanıtı alınamadı." });
        }

        // Yapay zekanın cevabını, belirlediğimiz "AÇIKLAMA:" delimiter'ına göre bölerek şube adını ve açıklama metnini ayırıyoruz.
        const [oneri, ...aciklamaArr] = replyRaw.split(/\s*AÇIKLAMA:\s*/i);
        const aciklamaGemini = aciklamaArr.join(" ").trim();

        // --- EN YAKIN ŞUBE HESAPLAMASI ---
        // Yapay zeka önerisine ek olarak, aynı aday listesi üzerinden "fiziksel olarak en yakın" şubeyi de hesaplayıp kullanıcıya sunuyoruz.
        let minMesafe = Infinity; // Başlangıçta minimum mesafeyi sonsuz olarak ayarlıyoruz.
        let enYakinSube = null;   // En yakın şubenin adını tutacak değişken.
        if (adaylar.length > 0) {
            adaylar.forEach((sube) => {
                // Her bir aday şube ile kullanıcının mevcut şubesi arasındaki mesafeyi hesapla.
                const mesafe = haversineDistance(
                    kullaniciSubesi.koordinat.lat, kullaniciSubesi.koordinat.lon,
                    sube.koordinat.lat, sube.koordinat.lon
                );
                // Eğer hesaplanan mesafe o anki minimum mesafeden daha küçükse, yeni minimum mesafe ve en yakın şube bu olur.
                if (mesafe < minMesafe) {
                    minMesafe = mesafe;
                    enYakinSube = sube.isim;
                }
            });
        } else {
            // Eğer hiçbir aday şube bulunamadıysa (çok nadir bir durum), bunu belirt.
            enYakinSube = "Uygun aday bulunamadı";
        }

        // Sonucu istemciye (frontend'e) JSON formatında gönderiyoruz.
        res.json({
            oneri: oneri.trim(), // Gemini'nin önerdiği şube adı.
            aciklama: aciklamaGemini || aciklama, // Eğer Gemini bir açıklama göndermezse, bizim oluşturduğumuz standart açıklamayı kullan.
            enYakin: enYakinSube // Sadece mesafeye göre en yakın olan şube.
        });

    } catch (error) {
        // 'try' bloğunda herhangi bir hata olursa (örn: API'ye ulaşılamadı, dosya okunamadı), bu blok çalışır.
        // Hatayı sunucu konsoluna yazdırarak bizim görmemizi sağlar.
        console.error("Gemini API rotasında hata:", error.response ? error.response.data : error.message);
        // İstemciye de sunucu tarafında bir hata oluştuğunu belirten genel bir mesaj gönderir.
        res.status(500).json({ mesaj: "Sunucu tarafında bir hata oluştu. API çağrısı başarısız." });
    }
});

// Bu router'ı, projenin ana dosyası (genellikle app.js veya server.js) tarafından kullanılabilir hale getiriyoruz.
module.exports = router;