// Error Alert Component
// Hata uyarı bileşeni
// Error alert component

import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * ErrorAlert Component
 * Hata mesajlarını gösterir
 * Displays error messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Hata mesajı / Error message
 * @param {string} props.title - Hata başlığı / Error title
 * @param {string} props.severity - Alert severity: 'error', 'warning', 'info', 'success'
 * @param {Function} props.onClose - Kapat butonu handler / Close button handler
 */
const ErrorAlert = ({
    message,
    title = 'Hata',
    severity = 'error',
    onClose
}) => {
    if (!message) return null;

    return (
        <Box sx={{ mb: 2 }}>
            <Alert
                severity={severity}
                icon={<ErrorOutlineIcon />}
                onClose={onClose}
                sx={{
                    '& .MuiAlert-message': {
                        width: '100%'
                    }
                }}
            >
                {title && <AlertTitle>{title}</AlertTitle>}
                {message}
            </Alert>
        </Box>
    );
};

export default ErrorAlert;
