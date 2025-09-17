import React, { useState } from 'react';
import axios from 'axios';
import WelcomeScreen from './WelcomeScreen';

const LoginForm = () => {
    const [girisBilgisi, setGirisBilgisi] = useState('');
    const [kullanici, setKullanici] = useState(null);
    const [hata, setHata] = useState('');

    const handleLogin = async () => {
        if (!girisBilgisi) {
            setHata('Lütfen TC Kimlik No veya Kullanıcı Adınızı girin.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/giris', {
                girisBilgisi: girisBilgisi
            });

            if (response.data.basarili) {
                setKullanici({
                    adSoyad: response.data.adSoyad,
                    sube: response.data.sube,
                    girisBilgisi: girisBilgisi
                });
                setHata('');
            } else {
                setHata('Kullanıcı bulunamadı.');
                setKullanici(null);
            }
        } catch (err) {
            setHata('Sunucuya bağlanılamadı.');
        }
    };

    if (kullanici) {
        return (
            <WelcomeScreen
                adSoyad={kullanici.adSoyad}
                sube={kullanici.sube}
                girisBilgisi={kullanici.girisBilgisi}
            />
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <img src="/logoo.jpg" alt="Logo" style={styles.logo} />
                <h1 style={styles.title}>Yapay Zeka Destekli Müşteri Şube Devri</h1>
                <label style={styles.label}>TC Kimlik No veya Müşteri No giriniz:</label>
                <input
                    type="text"
                    placeholder="TC Kimlik No 11 hane, Müşteri No en az 3 karakter olmalıdır"
                    value={girisBilgisi}
                    onChange={(e) => setGirisBilgisi(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleLogin} style={styles.button}>
                    Giriş Yap
                </button>
                {hata && <p style={styles.error}>{hata}</p>}
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        //background: 'linear-gradient(135deg,#fff 0,#f2f2f2 100%)'
    },
    container: {
        width: '100%',
        maxWidth: '390px',
        textAlign: 'center',
        padding: '30px 18px 22px 18px',
        border: '1px solid #e4e4e4',
        borderRadius: '15px',
        boxShadow: '0 3px 15px rgba(190,30,45,0.09), 0 1.5px 7px rgba(0,0,0,0.07)',
        backgroundColor: 'rgba(255,255,255,0.98)', // kartın arka planı hafif transparan yapabilirsin
        backdropFilter: 'blur(3.5px)', // şık bir blur efekti
    },
    logo: {
        width: '75px',
        marginBottom: '10px',
        borderRadius: 8,
        boxShadow: '0 1px 5px rgba(190,30,45,0.10)'
    },
    title: {
        fontSize: '23px',
        marginBottom: '19px',
        color: '#be1e2d',
        fontWeight: 700,
        letterSpacing: '0.8px'
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontSize: '14.7px',
        color: '#232323'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px'
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#be1e2d',
        color: '#fff',
        border: 'none',
        borderRadius: '7px',
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    error: {
        color: '#be1e2d',
        marginTop: '12px',
        fontWeight: 500
    }
};

export default LoginForm;
