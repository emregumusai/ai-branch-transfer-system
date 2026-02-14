// AI Recommendation Card Component - Premium Design
// AI öneri kartı bileşeni - Premium Tasarım
// Displays AI recommendation with premium styling and animations

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Alert
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { keyframes } from '@mui/system';

// Pulsating glow animation for AI icon
const pulseGlow = keyframes`
    0% {
        box-shadow: 0 0 5px rgba(30, 136, 229, 0.4);
    }
    50% {
        box-shadow: 0 0 20px rgba(30, 136, 229, 0.8), 0 0 30px rgba(108, 99, 255, 0.5);
    }
    100% {
        box-shadow: 0 0 5px rgba(30, 136, 229, 0.4);
    }
`;

/**
 * AIRecommendationCard Component
 * AI önerisi ve açıklama kartı - Premium görünüm
 * AI recommendation and explanation card - Premium appearance
 * 
 * @param {Object} props - Component props
 * @param {string} props.branchName - Önerilen şube adı / Recommended branch name
 * @param {string} props.explanation - Açıklama metni / Explanation text
 * @param {string} props.nearestBranch - En yakın şube / Nearest branch
 */
const AIRecommendationCard = ({
    branchName,
    explanation,
    nearestBranch
}) => {
    if (!branchName) return null;

    return (
        <Card
            elevation={0}
            sx={{
                mb: 3,
                position: 'relative',
                overflow: 'visible',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1E88E5 0%, #6C63FF 50%, #00D395 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(30, 136, 229, 0.25)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #1E88E5 0%, #6C63FF 100%)',
                            animation: `${pulseGlow} 2s ease-in-out infinite`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <SmartToyIcon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #1E88E5 0%, #6C63FF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        Yapay Zeka Önerisi
                    </Typography>
                </Box>

                <Box
                    sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.08) 0%, rgba(108, 99, 255, 0.08) 100%)',
                        borderRadius: 2,
                        mb: 3,
                        border: '1px solid rgba(30, 136, 229, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: 'linear-gradient(90deg, #1E88E5 0%, #6C63FF 100%)'
                        }
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Önerilen Şube
                    </Typography>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 800,
                            mt: 1,
                            background: 'linear-gradient(135deg, #0A2540 0%, #1E88E5 50%, #6C63FF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        {branchName}
                    </Typography>
                </Box>

                {explanation && (
                    <Alert
                        icon={<InfoOutlinedIcon />}
                        severity="info"
                        sx={{ 
                            mb: 2,
                            borderRadius: 2,
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(41, 182, 246, 0.08)',
                            border: '1px solid rgba(41, 182, 246, 0.3)',
                            '& .MuiAlert-icon': {
                                color: '#1E88E5'
                            }
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            {explanation}
                        </Typography>
                    </Alert>
                )}

                {nearestBranch && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <LocationOnIcon fontSize="small" sx={{ color: '#FFD700' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            En Yakın Şube:
                        </Typography>
                        <Chip
                            label={nearestBranch}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                color: '#0A2540',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AIRecommendationCard;
