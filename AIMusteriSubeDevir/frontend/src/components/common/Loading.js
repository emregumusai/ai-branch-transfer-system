// Loading Spinner Component
// Yükleme göstergesi bileşeni
// Loading indicator component

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loading Component
 * Yükleme durumunda gösterilen spinner
 * Spinner shown during loading state
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Yükleme mesajı / Loading message
 * @param {string} props.size - Spinner boyutu / Spinner size (default: 40)
 * @param {boolean} props.fullScreen - Tam ekran mod / Full screen mode
 */
const Loading = ({
    message = 'Yükleniyor...',
    size = 40,
    fullScreen = false
}) => {
    const containerStyle = fullScreen
        ? {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'background.default'
        }
        : {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
        };

    return (
        <Box sx={containerStyle}>
            <CircularProgress size={size} />
            {message && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Loading;
