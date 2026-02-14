// Common Button Component
// Ortak düğme bileşeni
// Reusable button component with consistent styling

import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

/**
 * Button Component
 * Material-UI Button wrapper with loading state
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Loading durumu / Loading state
 * @param {boolean} props.disabled - Disabled durumu / Disabled state
 * @param {string} props.variant - Button variant: 'contained', 'outlined', 'text'
 * @param {string} props.color - Button color: 'primary', 'secondary', 'error', etc.
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {React.ReactNode} props.startIcon - Sol taraf ikonu / Start icon
 * @param {React.ReactNode} props.endIcon - Sağ taraf ikonu / End icon
 * @param {Function} props.onClick - Click handler
 * @param {string} props.fullWidth - Full width button
 * @param {React.ReactNode} props.children - Button içeriği / Button content
 */
const Button = ({
    loading = false,
    disabled = false,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    startIcon,
    endIcon,
    onClick,
    fullWidth = false,
    children,
    ...rest
}) => {
    return (
        <MuiButton
            variant={variant}
            color={color}
            size={size}
            disabled={disabled || loading}
            startIcon={loading ? null : startIcon}
            endIcon={loading ? null : endIcon}
            onClick={onClick}
            fullWidth={fullWidth}
            {...rest}
        >
            {loading ? (
                <>
                    <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ mr: 1 }}
                    />
                    Yükleniyor...
                </>
            ) : (
                children
            )}
        </MuiButton>
    );
};

export default Button;
