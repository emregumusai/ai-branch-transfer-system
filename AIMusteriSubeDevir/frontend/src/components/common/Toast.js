// Toast Notification Component
// Toast bildirim bileşeni
// Snackbar wrapper for user feedback

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    Snackbar,
    Alert,
    AlertTitle,
    Slide
} from '@mui/material';

/**
 * Toast Context
 * Toast context for global access
 */
const ToastContext = createContext();

/**
 * Slide Transition
 * Yukarıdan aşağıya slide geçişi
 */
function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

/**
 * ToastProvider Component
 * Toast provider for app-wide toast notifications
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ToastProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'
    const [title, setTitle] = useState('');

    /**
     * Show Toast
     * Toast göster
     */
    const showToast = useCallback((msg, sev = 'info', titleText = '') => {
        setMessage(msg);
        setSeverity(sev);
        setTitle(titleText);
        setOpen(true);
    }, []);

    /**
     * Hide Toast
     * Toast gizle
     */
    const hideToast = useCallback(() => {
        setOpen(false);
    }, []);

    /**
     * Handle Close
     * Kapatma işlemini yönet
     */
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        hideToast();
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={SlideTransition}
                sx={{
                    top: 24,
                    '& .MuiSnackbar-root': {
                        top: 24
                    }
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    elevation={6}
                    sx={{
                        minWidth: 300,
                        borderRadius: 2,
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0px 8px 24px rgba(10, 37, 64, 0.2)'
                    }}
                >
                    {title && <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>}
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

/**
 * useToast Hook
 * Toast kullanımı için custom hook
 * 
 * @returns {Object} - { showToast, hideToast }
 * 
 * @example
 * const { showToast } = useToast();
 * showToast('İşlem başarılı!', 'success', 'Başarılı');
 * showToast('Bir hata oluştu', 'error');
 * showToast('Uyarı mesajı', 'warning');
 * showToast('Bilgi mesajı', 'info');
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export default ToastProvider;
