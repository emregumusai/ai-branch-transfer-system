// MUI Theme Configuration - Banking Professional Edition
// Material-UI tema yapılandırması - Bankacılık Profesyonel Sürümü
// Theme configuration for premium banking application

import { createTheme } from '@mui/material/styles';

/**
 * Banking Professional Color Palette
 * Bankacılık Profesyonel Renk Paleti
 * Inspired by: Apple Card, Revolut, N26
 */
const colors = {
    // Primary - Deep Blues (Trust & Stability)
    primary: {
        main: '#1E88E5',        // Vibrant Blue
        light: '#42A5F5',       // Sky Blue
        dark: '#0A2540',        // Deep Navy
        lighter: '#E3F2FD',     // Ice Blue
        contrastText: '#FFFFFF'
    },
    
    // Secondary - Purple/Pink Gradient (Modern & Premium)
    secondary: {
        main: '#6C63FF',        // Vivid Purple
        light: '#9C89FF',       // Lavender
        dark: '#4A3FD9',        // Deep Purple
        accent: '#FF6584',      // Pink Accent
        contrastText: '#FFFFFF'
    },
    
    // Success - Mint Green (Positive Actions)
    success: {
        main: '#00D395',        // Mint Green
        light: '#4ECDC4',       // Turquoise
        dark: '#00A878',        // Forest Green
        lighter: '#E0F7F4'      // Soft Mint
    },
    
    // Error - Vibrant Red (Alerts)
    error: {
        main: '#FF5252',        // Vibrant Red
        light: '#FF8A80',       // Soft Red
        dark: '#D32F2F',        // Dark Red
        lighter: '#FFEBEE'      // Light Pink
    },
    
    // Warning - Amber (Caution)
    warning: {
        main: '#FFA726',        // Amber
        light: '#FFB74D',       // Light Amber
        dark: '#F57C00',        // Dark Orange
        lighter: '#FFF3E0'      // Soft Orange
    },
    
    // Info - Bright Blue (Information)
    info: {
        main: '#29B6F6',        // Bright Blue
        light: '#4FC3F7',       // Sky
        dark: '#0288D1',        // Deep Blue
        lighter: '#E1F5FE'      // Ice
    },
    
    // Premium Accents - Gold, Silver, Bronze
    premium: {
        gold: '#FFD700',        // Gold
        silver: '#C0C0C0',      // Silver
        bronze: '#CD7F32'       // Bronze
    },
    
    // Neutral - Grays & Backgrounds
    neutral: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121'
    },
    
    // Background - Multi-layer
    background: {
        default: '#F8F9FA',     // Off-white
        paper: '#FFFFFF',       // Pure white
        surface: '#FAFBFC',     // Soft white
        elevated: '#FFFFFF'     // Cards
    },
    
    // Text - High Contrast
    text: {
        primary: '#0A2540',           // Deep Navy
        secondary: '#475569',         // Slate Gray
        disabled: '#94A3B8',          // Light Gray
        hint: '#CBD5E1'               // Very Light Gray
    },
    
    // Glassmorphism - Transparency Layers
    glass: {
        white10: 'rgba(255, 255, 255, 0.1)',
        white20: 'rgba(255, 255, 255, 0.2)',
        white40: 'rgba(255, 255, 255, 0.4)',
        white60: 'rgba(255, 255, 255, 0.6)',
        white80: 'rgba(255, 255, 255, 0.8)',
        white90: 'rgba(255, 255, 255, 0.9)',
        white95: 'rgba(255, 255, 255, 0.95)',
        dark40: 'rgba(10, 37, 64, 0.4)',
        dark60: 'rgba(10, 37, 64, 0.6)'
    }
};

/**
 * Typography Settings - Modern Banking
 * Tipografi ayarları - Modern Bankacılık
 */
const typography = {
    fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
    ].join(','),
    
    // Başlık boyutları
    h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em'
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em'
    },
    h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.6
    },
    
    // Gövde metinleri
    body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.01em'
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em'
    },
    
    // Düğme metni
    button: {
        fontSize: '0.9375rem',
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.02em'
    }
};

/**
 * Spacing Configuration
 * Boşluk yapılandırması (8px temel birim)
 */
const spacing = 8;

/**
 * Border Radius
 * Köşe yuvarlama değerleri
 */
const shape = {
    borderRadius: 8  // Varsayılan köşe yuvarlama (8px)
};

/**
 * Breakpoints (Responsive)
 * Ekran boyutu kırılma noktaları
 */
const breakpoints = {
    values: {
        xs: 0,      // Extra small (mobil)
        sm: 600,    // Small (tablet)
        md: 960,    // Medium (küçük laptop)
        lg: 1280,   // Large (laptop)
        xl: 1920    // Extra large (büyük ekran)
    }
};

/**
 * Custom Shadows - Soft & Ambient
 * Özel gölge değerleri - Yumuşak & Ambient
 */
const shadows = [
    'none',
    '0px 2px 4px rgba(10, 37, 64, 0.08)',
    '0px 4px 8px rgba(10, 37, 64, 0.10)',
    '0px 8px 16px rgba(10, 37, 64, 0.12)',
    '0px 12px 24px rgba(10, 37, 64, 0.14)',
    '0px 16px 32px rgba(10, 37, 64, 0.16)',
    '0px 20px 40px rgba(10, 37, 64, 0.18)',
    '0px 24px 48px rgba(10, 37, 64, 0.20)',
    ...Array(17).fill('0px 24px 48px rgba(10, 37, 64, 0.20)')
];

/**
 * Component Overrides - Banking Professional
 * Bileşen özelleştirmeleri - Bankacılık Profesyonel
 */
const components = {
    // Button özelleştirmeleri
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 10,
                padding: '11px 28px',
                boxShadow: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: 600,
                '&:hover': {
                    boxShadow: '0px 8px 16px rgba(10, 37, 64, 0.15)',
                    transform: 'translateY(-1px)'
                },
                '&:active': {
                    transform: 'translateY(0px)'
                }
            },
            containedPrimary: {
                background: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
                '&:hover': {
                    background: 'linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)',
                    boxShadow: '0px 10px 20px rgba(30, 136, 229, 0.3)'
                }
            },
            containedSecondary: {
                background: 'linear-gradient(135deg, #6C63FF 0%, #9C89FF 100%)',
                '&:hover': {
                    background: 'linear-gradient(135deg, #4A3FD9 0%, #6C63FF 100%)',
                    boxShadow: '0px 10px 20px rgba(108, 99, 255, 0.3)'
                }
            },
            containedSuccess: {
                background: 'linear-gradient(135deg, #00D395 0%, #4ECDC4 100%)',
                '&:hover': {
                    background: 'linear-gradient(135deg, #00A878 0%, #00D395 100%)',
                    boxShadow: '0px 10px 20px rgba(0, 211, 149, 0.3)'
                }
            }
        }
    },
    
    // Card özelleştirmeleri
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                boxShadow: '0px 4px 16px rgba(10, 37, 64, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    boxShadow: '0px 8px 24px rgba(10, 37, 64, 0.12)'
                }
            }
        }
    },
    
    // TextField özelleştirmeleri
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            size: 'medium'
        },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 10,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover fieldset': {
                        borderColor: '#1E88E5',
                        borderWidth: 2
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#1E88E5',
                        borderWidth: 2
                    }
                }
            }
        }
    },
    
    // Chip özelleştirmeleri
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 10,
                fontWeight: 600
            }
        }
    },
    
    // Checkbox özelleştirmeleri
    MuiCheckbox: {
        styleOverrides: {
            root: {
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(30, 136, 229, 0.04)'
                }
            }
        }
    },
    
    // Radio özelleştirmeleri
    MuiRadio: {
        styleOverrides: {
            root: {
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(30, 136, 229, 0.04)'
                }
            }
        }
    },
    
    // Dialog özelleştirmeleri
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 20,
                boxShadow: '0px 24px 48px rgba(10, 37, 64, 0.2)'
            }
        }
    }
};

/**
 * Create MUI Theme
 * MUI teması oluştur
 */
const theme = createTheme({
    palette: colors,
    typography,
    spacing,
    shape,
    breakpoints,
    shadows,
    components
});

export default theme;
