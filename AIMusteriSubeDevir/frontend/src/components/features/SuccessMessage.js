// Success Message Component
// Başarı mesajı bileşeni
// Displays branch transfer success message

import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * SuccessMessage Component
 * Şube değişikliği başarı mesajı
 * Branch transfer success message
 * 
 * @param {Object} props - Component props
 * @param {string} props.oldBranch - Eski şube / Old branch
 * @param {string} props.newBranch - Yeni şube / New branch
 */
const SuccessMessage = ({ oldBranch, newBranch }) => {
    return (
        <Card
            elevation={6}
            sx={{
                background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.08) 0%, rgba(66, 165, 245, 0.08) 100%)',
                border: 2,
                borderColor: 'primary.main',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #1E88E5 0%, #42A5F5 50%, #1E88E5 100%)'
                }
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 80,
                            height: 80,
                            mb: 3,
                            boxShadow: '0 8px 24px rgba(30, 136, 229, 0.3)'
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 48 }} />
                    </Avatar>

                    <Typography
                        variant="h4"
                        color="primary.dark"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Şube Değişikliği Başarılı!
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Şube devir işleminiz başarıyla tamamlanmıştır
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            width: '100%',
                            maxWidth: 500
                        }}
                    >
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Eski Şube
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="error">
                                {oldBranch}
                            </Typography>
                        </Box>

                        <ArrowForwardIcon color="primary" fontSize="large" />

                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Yeni Şube
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.dark">
                                {newBranch}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 3 }}
                    >
                        İyi günler dileriz 🎉
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SuccessMessage;
