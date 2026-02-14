// Preference Selector Component
// Tercih seçici bileşeni
// Multi-select checkbox component for branch preferences with toast feedback

import React, { useEffect, useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useToast } from '../common/Toast';

/**
 * PreferenceSelector Component
 * Şube tercihleri seçim bileşeni (max 4 seçim, toast feedback)
 * Branch preferences selection component (max 4 selections, toast feedback)
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.preferences - Mevcut seçili tercihler / Current selected preferences
 * @param {Function} props.onPreferenceChange - Tercih değişiklik handler / Preference change handler
 * @param {boolean} props.disabled - Disabled durumu / Disabled state
 */
const PreferenceSelector = ({
    preferences = [],
    onPreferenceChange,
    disabled = false
}) => {
    const MAX_SELECTIONS = 4;
    const { showToast } = useToast();
    const attemptedMoreThanMax = useRef(false);

    const preferenceOptions = [
        { value: 'ATM Yoğunluğu Düşük', label: 'ATM Yoğunluğu Düşük' },
        { value: 'Şube Yoğunluğu Düşük', label: 'Şube Yoğunluğu Düşük' },
        { value: 'Engelli Erişimi Mevcut', label: 'Engelli Erişimi Mevcut' },
        { value: 'Park Yeri Mevcut', label: 'Park Yeri Mevcut' },
        { value: 'Kolay Ulaşım', label: 'Kolay Ulaşım' },
        { value: 'Uzun Çalışma Saatleri', label: 'Uzun Çalışma Saatleri' },
        { value: 'Bireysel Bankacılık Hizmeti', label: 'Bireysel Bankacılık Hizmeti' },
        { value: 'Kurumsal Bankacılık Hizmeti', label: 'Kurumsal Bankacılık Hizmeti' },
        { value: 'Kobi Bankacılığı Hizmeti', label: 'Kobi Bankacılığı Hizmeti' }
    ];

    const handleChange = (value) => {
        const isSelected = preferences.includes(value);

        if (isSelected) {
            // Seçimi kaldır / Remove selection
            onPreferenceChange(preferences.filter(p => p !== value));
            attemptedMoreThanMax.current = false;
        } else {
            // Yeni seçim ekle (max 4) / Add new selection (max 4)
            if (preferences.length < MAX_SELECTIONS) {
                const newPreferences = [...preferences, value];
                onPreferenceChange(newPreferences);
                attemptedMoreThanMax.current = false;
                
                // 4. tercih seçildiğinde bilgilendirme göster
                if (newPreferences.length === MAX_SELECTIONS) {
                    showToast(
                        `${MAX_SELECTIONS} tercih seçtiniz. Bu maksimum sayıdır.`,
                        'info',
                        'Tercih Tamamlandı'
                    );
                }
            } else {
                // 5. veya daha fazla seçim denemesi - Toast göster
                if (!attemptedMoreThanMax.current) {
                    showToast(
                        `En fazla ${MAX_SELECTIONS} tercih seçebilirsiniz. Lütfen önce bir tercihi kaldırın.`,
                        'warning',
                        'Tercih Limiti'
                    );
                    attemptedMoreThanMax.current = true;
                }
            }
        }
    };

    // Preferences değiştiğinde attemptedMoreThanMax'ı sıfırla
    useEffect(() => {
        if (preferences.length < MAX_SELECTIONS) {
            attemptedMoreThanMax.current = false;
        }
    }, [preferences]);

    return (
        <Card 
            elevation={0} 
            sx={{ 
                bgcolor: 'grey.50', 
                mb: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: '0 4px 12px rgba(30, 136, 229, 0.1)'
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircleIcon color="primary" sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Şube Tercihlerinizi Seçin
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                    En fazla {MAX_SELECTIONS} tercih seçebilirsiniz. 
                    Seçimleriniz AI önerisi için kullanılacaktır.
                </Typography>

                <FormGroup>
                    {preferenceOptions.map((option) => {
                        const isSelected = preferences.includes(option.value);
                        const isDisabled = disabled || (!isSelected && preferences.length >= MAX_SELECTIONS);

                        return (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleChange(option.value)}
                                        disabled={isDisabled}
                                        color="primary"
                                        sx={{
                                            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    />
                                }
                                label={option.label}
                                sx={{
                                    py: 0.5,
                                    px: 1,
                                    borderRadius: 2,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backgroundColor: isSelected ? 'primary.lighter' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: isSelected ? 'primary.lighter' : 'grey.100',
                                        transform: 'translateX(4px)'
                                    },
                                    '& .MuiFormControlLabel-label': {
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? 'primary.dark' : 'text.primary',
                                        fontSize: isSelected ? '0.95rem' : '0.9rem',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    },
                                    opacity: isDisabled && !isSelected ? 0.4 : 1,
                                    cursor: isDisabled && !isSelected ? 'not-allowed' : 'pointer'
                                }}
                            />
                        );
                    })}
                </FormGroup>
            </CardContent>
        </Card>
    );
};

export default PreferenceSelector;
