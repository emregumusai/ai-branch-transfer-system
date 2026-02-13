import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TercihSiralama from "./TercihSiralama";

// Spinner bileşeni
const Spinner = () => (
    <span style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: 28,
        height: 28
    }}>
        <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
            <circle cx="25" cy="25" r="20" fill="none" stroke="#be1e2d" strokeWidth="5" strokeLinecap="round"
                strokeDasharray="31.415, 31.415"
                transform="rotate(-90 25 25)">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25"
                    to="360 25 25" dur="1s" repeatCount="indefinite" />
            </circle>
        </svg>
    </span>
);

const WelcomeScreen = ({ adSoyad, sube: ilkSube, girisBilgisi }) => {
    const [mevcutSube, setMevcutSube] = useState(ilkSube);
    const [aiOneri, setAiOneri] = useState(null);
    const [aiAciklama, setAiAciklama] = useState('');
    const [enYakinSube, setEnYakinSube] = useState(null);
    const [serbestSecim, setSerbestSecim] = useState('');
    const [mesaj, setMesaj] = useState('');
    const [guncellendi, setGuncellendi] = useState(false);
    const [tumSubeler, setTumSubeler] = useState([]);
    const [secimler, setSecimler] = useState([]);
    const [aktifSecim, setAktifSecim] = useState('ai');
    const [eskiSube, setEskiSube] = useState(ilkSube);
    const [aiYukleniyor, setAiYukleniyor] = useState(false);
    const [siralaModu, setSiralaModu] = useState(false);
    const [siralaUyarisi, setSiralaUyarisi] = useState('');

    const tercihOpsiyonlari = [
        'ATM Yoğunluğu Düşük',
        'Şube Yoğunluğu Düşük',
        'Engelli Erişimi Mevcut',
        'Park Yeri Mevcut',
        'Kolay Ulaşım',
        'Uzun Çalışma Saatleri',
        'Bireysel Bankacılık Hizmeti',
        'Kurumsal Bankacılık Hizmeti',
        'Kobi Bankacılığı Hizmeti'
    ];

    useEffect(() => {
        axios.get('http://localhost:5000/subeler')
            .then(res => setTumSubeler(res.data.subeler || []))
            .catch(() => setTumSubeler([]));
    }, []);

    // ==================================================================
    // HATA DÜZELTMESİ BURADA YAPILDI
    // ==================================================================
    const tercihDegistir = (tercih) => {
        setSiralaUyarisi('');

        const isAlreadySelected = secimler.includes(tercih);

        if (isAlreadySelected) {
            // Kullanıcı bir seçimi kaldırıyor
            setSecimler(secimler.filter((s) => s !== tercih));
            setMesaj(''); // Seçim kaldırılınca uyarıyı temizle
        } else {
            // Kullanıcı yeni bir seçim ekliyor
            // Sadece mevcut seçim sayısı 4'ten az ise eklemeye izin ver
            if (secimler.length < 4) {
                const yeniSecimler = [...secimler, tercih];
                setSecimler(yeniSecimler);

                // Eğer yeni seçimle birlikte toplam 4 olduysa uyarıyı göster
                if (yeniSecimler.length === 4) {
                    setMesaj('En fazla 4 tercih yapabilirsiniz.');
                } else {
                    setMesaj('');
                }
            }
        }
    };
    // ==================================================================

    const getAiSubeOnerisi = async (tercihlerSirali) => {
        setMesaj('');
        setAiYukleniyor(true);
        try {
            const response = await axios.post('http://localhost:5000/gemini', {
                il: 'İstanbul',
                secimler: tercihlerSirali,
                konum: mevcutSube
            });
            if (response.data.oneri) {
                setAiOneri(response.data.oneri);
                setAiAciklama(response.data.aciklama || '');
                setEnYakinSube(response.data.enYakin);
            } else {
                setMesaj('Yapay zekâ önerisi alınamadı.');
            }
        } catch (err) {
            setMesaj('Yapay zekâ hizmetine ulaşılamadı.');
        } finally {
            setAiYukleniyor(false);
        }
    };

    const handleAkilliOneriTikla = () => {
        setSiralaUyarisi('');
        if (secimler.length > 1) {
            setSiralaModu(true);
        } else if (secimler.length === 1) {
            getAiSubeOnerisi(secimler);
        }
    };

    const subeDegistir = async (yeniSube) => {
        try {
            const response = await axios.post('http://localhost:5000/sube-guncelle', {
                girisBilgisi,
                yeniSube: yeniSube
            });
            if (response.data.basarili) {
                setGuncellendi(true);
                setEskiSube(mevcutSube);
                setMevcutSube(yeniSube);
                setMesaj(response.data.mesaj);
            } else {
                setMesaj(response.data.mesaj);
            }
        } catch (error) {
            setMesaj('Sunucu hatası oluştu.');
        }
    };

    let secilenSube = "";
    if (aktifSecim === "ai") secilenSube = aiOneri;
    if (aktifSecim === "enYakin") secilenSube = enYakinSube;
    if (aktifSecim === "serbest") secilenSube = serbestSecim;

    return (
        <div style={styles.wrapper}>
            {siralaModu && (
                <TercihSiralama
                    tercihler={secimler}
                    onSiralamaOnayla={tercihlerSirali => {
                        setSiralaModu(false);
                        getAiSubeOnerisi(tercihlerSirali);
                    }}
                    onIptal={() => {
                        setSiralaModu(false);
                        setSiralaUyarisi('Öneri alabilmek için tercihlerinizi öncelik sırasına göre sıralamalısınız.');
                    }}
                />
            )}

            <div style={styles.card}>
                {aiYukleniyor && (
                    <div style={styles.loadingOverlay}>
                        <Spinner />
                        <p style={{ margin: '12px 0 0 0', color: '#be1e2d', fontSize: 16 }}>Yapay zeka önerileri getiriliyor...</p>
                    </div>
                )}

                {!guncellendi ? (
                    <>
                        <div style={styles.header}>
                            <img src="/logoo.jpg" alt="Logo" style={styles.logo} />
                            <h1 style={styles.title}>Yapay Zeka Destekli Müşteri Şube Devri</h1>
                        </div>
                        <p style={{ fontSize: 16, marginBottom: 10 }}>
                            Hoş geldiniz, <strong style={{ color: '#be1e2d' }}>{adSoyad}</strong>!
                        </p>
                        <p style={styles.label}>
                            Mevcut şubeniz: <strong style={{ color: '#be1e2d' }}>{mevcutSube}</strong>
                        </p>

                        <div style={styles.box}>
                            <p><b>Yapay zekâ destekli şube önerisi almak ister misiniz?</b></p>
                            <div>
                                <p style={{ marginBottom: 4 }}>Şube tercihlerinizi seçin:</p>
                                <div style={styles.tercihlerVertical}>
                                    {tercihOpsiyonlari.map((tercih) => (
                                        <label key={tercih} style={{ ...styles.checkboxLabel, fontWeight: secimler.includes(tercih) ? 'bold' : 'normal', color: secimler.includes(tercih) ? '#be1e2d' : '#333' }}>
                                            <input type="checkbox" checked={secimler.includes(tercih)} onChange={() => tercihDegistir(tercih)} disabled={(!secimler.includes(tercih) && secimler.length >= 4) || aiYukleniyor} />
                                            {tercih}
                                        </label>
                                    ))}
                                </div>
                                {mesaj && (<p style={{ fontSize: 13.5, color: '#be1e2d', marginTop: 4 }}>{mesaj}</p>)}
                            </div>

                            {secimler.length > 0 && (
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 16, flexDirection: "column", alignItems: "center" }}>
                                    <button
                                        style={styles.aiBtn}
                                        disabled={aiYukleniyor}
                                        onClick={handleAkilliOneriTikla}
                                    >
                                        Yapay Zeka ile Şube Öner
                                    </button>
                                    {siralaUyarisi && (
                                        <p style={{ fontSize: 13, color: "#be1e2d", marginTop: 8, textAlign: 'center' }}>{siralaUyarisi}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {(aiOneri || enYakinSube) && (
                            <div style={styles.oneriBox}>
                                <strong>Bir öneri seçin:</strong>
                                <div style={styles.radioGroup}>
                                    <label style={{ ...styles.radioLabel, ...(aktifSecim === "ai" ? styles.radioSelected : {}) }}>
                                        <input type="radio" checked={aktifSecim === "ai"} onChange={() => setAktifSecim("ai")} disabled={!aiOneri} />
                                        <span style={{ fontWeight: 600 }}>Yapay Zeka Anket Sonucuna Uygun Şubeye Ata:</span>
                                        <span style={{ opacity: aktifSecim === "ai" ? 1 : 0.5, pointerEvents: aktifSecim === "ai" ? "auto" : "none" }}>
                                            {" "}{aiOneri || "-"}
                                            {aiAciklama && (
                                                <span style={{ fontStyle: "italic", color: "#4e4e4e" }}><br />{aiAciklama}</span>
                                            )}
                                        </span>
                                    </label>
                                    <label style={{ ...styles.radioLabel, ...(aktifSecim === "enYakin" ? styles.radioSelected : {}) }}>
                                        <input type="radio" checked={aktifSecim === "enYakin"} onChange={() => setAktifSecim("enYakin")} disabled={!enYakinSube} />
                                        <span style={{ fontWeight: 600 }}>En Kısa Mesafedeki Şubeye Ata:</span>
                                        <span style={{ opacity: aktifSecim === "enYakin" ? 1 : 0.5, pointerEvents: aktifSecim === "enYakin" ? "auto" : "none" }}>
                                            {" "}{enYakinSube || "-"}
                                        </span>
                                    </label>
                                    <label style={{ ...styles.radioLabel, ...(aktifSecim === "serbest" ? styles.radioSelected : {}) }}>
                                        <input type="radio" checked={aktifSecim === "serbest"} onChange={() => setAktifSecim("serbest")} />
                                        <span style={{ fontWeight: 600 }}>Serbest Seçim Şubesine Ata:</span>
                                        <select value={serbestSecim} onChange={e => setSerbestSecim(e.target.value)} style={styles.select} disabled={aktifSecim !== "serbest"}>
                                            <option value="">Bir şube seçin...</option>
                                            {tumSubeler.map(s => (
                                                <option key={s.isim} value={s.isim}>{s.isim}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                                    <button onClick={() => subeDegistir(secilenSube)} style={styles.button} disabled={!secilenSube}>
                                        Şube Devrini Gerçekleştir
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={styles.successBox}>
                        <h2 style={{ color: '#be1e2d', fontWeight: 700, marginBottom: 8 }}>Şube Değişikliği Başarılı!</h2>
                        <p>
                            <b>Eski şubeniz:</b> <span style={{ color: '#be1e2d' }}>{eskiSube}</span><br />
                            <b>Yeni şubeniz:</b> <span style={{ color: '#333' }}>{mevcutSube}</span>
                        </p>
                        <p style={{ marginTop: 16, color: '#222' }}>İyi günler dileriz.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Stillerde değişiklik yok, aynı kalabilir.
const styles = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: '100%',
        maxWidth: 520,
        padding: '32px 28px 24px 28px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 20,
        boxShadow: '0 6px 36px rgba(190,30,45,0.09), 0 1.5px 7px rgba(0,0,0,0.07)',
        border: '1.5px solid #ebe4e4',
        backdropFilter: 'blur(5px)',
        position: 'relative'
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(2px)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        color: '#be1e2d',
        fontWeight: 'bold',
        fontSize: 18
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 8
    },
    logo: {
        width: 60,
        marginBottom: 6,
        borderRadius: 7,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    title: {
        fontSize: 22,
        fontWeight: 700,
        color: '#be1e2d',
        margin: 0,
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        margin: '12px 0 10px 0',
        color: '#232323'
    },
    box: {
        background: '#f7f7f7',
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(190,30,45,0.03)',
        padding: 18,
        marginBottom: 18
    },
    tercihlerVertical: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginBottom: 8
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333'
    },
    aiBtn: {
        padding: '10px 24px',
        background: '#be1e2d',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 16,
        marginTop: 8,
        boxShadow: '0 1px 6px rgba(190,30,45,0.09)'
    },
    oneriBox: {
        background: '#fff0f1',
        border: '1.3px solid #be1e2d33',
        borderRadius: 12,
        marginTop: 18,
        padding: 16,
        boxShadow: '0 2px 10px rgba(190,30,45,0.05)'
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 10
    },
    radioLabel: {
        fontSize: 15,
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    radioSelected: {
        fontWeight: 'bold',
        background: '#fbeaec',
        borderRadius: 7,
        boxShadow: '0 1px 4px #be1e2d11',
        padding: "7px 10px",
        margin: "-7px -10px"
    },
    select: {
        marginLeft: 10,
        padding: '5px 10px',
        fontSize: 15,
        borderRadius: 4,
        border: '1px solid #be1e2d77'
    },
    button: {
        padding: '10px 22px',
        background: '#be1e2d',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 15,
        marginTop: 14
    },
    successBox: {
        background: '#f3f8f2',
        border: '1.6px solid #88b982',
        borderRadius: 13,
        padding: 24,
        textAlign: 'center'
    },
    error: {
        color: '#be1e2d',
        marginTop: 13,
        fontWeight: 500
    }
};

export default WelcomeScreen;
