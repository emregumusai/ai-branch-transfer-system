// Login Form Component (Refactored with MUI + Redux + Glassmorphism)
// Giriş formu bileşeni (MUI + Redux + Glassmorphism ile refactor edilmiş)
// User login form with Material-UI, Redux, and modern glass effects

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
    Container
} from '@mui/material';
import { loginUser, selectIsLoading, selectError } from '../store/slices/authSlice';
import WelcomeScreen from './WelcomeScreen';
import Button from './common/Button';
import ErrorAlert from './common/ErrorAlert';

/**
 * LoginForm Component
 * Kullanıcı giriş formu
 * User login form
 */
const LoginForm = () => {
    // Local state
    const [girisBilgisi, setGirisBilgisi] = useState('');
    const [localError, setLocalError] = useState('');

    // Redux state
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    /**
     * Handle Login
     * Giriş işlemini yönetir
     */
    const handleLogin = async () => {
        setLocalError('');

        // Validasyon
        if (!girisBilgisi || girisBilgisi.trim() === '') {
            setLocalError('Lütfen TC Kimlik No veya Kullanıcı Adınızı girin.');
            return;
        }

        // Redux action dispatch
        dispatch(loginUser(girisBilgisi));
    };

    /**
     * Handle Enter Key
     * Enter tuşu ile giriş
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    // Kullanıcı giriş yapmışsa WelcomeScreen'i göster
    // If user is logged in, show WelcomeScreen
    if (user) {
        return <WelcomeScreen />;
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1E88E5 0%, #6C63FF 50%, #42A5F5 100%)',
                position: 'relative',
                py: 4,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(225deg, rgba(0, 211, 149, 0.1) 0%, rgba(255, 101, 132, 0.1) 100%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        backdropFilter: 'blur(40px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(10, 37, 64, 0.2)'
                    }}
                >
                    <CardContent sx={{ p: 5 }}>
                        {/* Logo ve Başlık */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 4
                            }}
                        >
                            {/* BankOfAI Logo */}
                            <Box
                                component="img"
                                src="/BankOfAI.png"
                                alt="BankOfAI Logo"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 3,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 16px rgba(10, 37, 64, 0.15)',
                                    objectFit: 'contain',
                                    background: '#fff',
                                    p: 1
                                }}
                            />

                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    background: 'linear-gradient(135deg, #1E88E5 0%, #6C63FF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    mb: 1
                                }}
                            >
                                AI Şube Devir Sistemi
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    fontWeight: 500
                                }}
                            >
                                BankOfAI - Yapay Zeka Destekli Şube Yönetimi
                            </Typography>
                        </Box>

                        {/* Hata Mesajları */}
                        {(localError || error) && (
                            <ErrorAlert
                                message={localError || error}
                                title="Giriş Hatası"
                            />
                        )}

                        {/* Giriş Formu */}
                        <Box component="form" noValidate>
                            <TextField
                                fullWidth
                                label="TC Kimlik No veya Kullanıcı Adı"
                                placeholder="11 haneli TC veya kullanıcı adınız"
                                value={girisBilgisi}
                                onChange={(e) => setGirisBilgisi(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                margin="normal"
                                autoFocus
                                InputLabelProps={{ 
                                    sx: { 
                                        fontWeight: 600,
                                        bgcolor: 'background.paper',
                                        px: 0.5,
                                        '&.MuiInputLabel-shrink': {
                                            bgcolor: 'background.paper'
                                        }
                                    }
                                }}
                                helperText="TC Kimlik No 11 hane, Kullanıcı No en az 3 karakter olmalıdır"
                                sx={{ mb: 3 }}
                            />

                            <Button
                                fullWidth
                                size="large"
                                onClick={handleLogin}
                                loading={isLoading}
                                disabled={!girisBilgisi.trim()}
                                sx={{
                                    height: 50,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #1E88E5 0%, #6C63FF 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1565C0 0%, #4A3FD9 100%) !important',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0px 12px 24px rgba(30, 136, 229, 0.4)'
                                    }
                                }}
                            >
                                Giriş Yap
                            </Button>
                        </Box>

                        {/* Alt Bilgi */}
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            textAlign="center"
                            display="block"
                            sx={{ mt: 3, fontWeight: 500 }}
                        >
                            🔒 Güvenli giriş için TC Kimlik No veya Kullanıcı Adınızı kullanın
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default LoginForm;
