// Branch Selection Options Component - Enhanced Visual Feedback
// Şube seçim seçenekleri bileşeni - Gelişmiş Görsel Geri Bildirim
// Radio group for selecting branch transfer option with fade effects

import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Select,
    MenuItem,
    Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * BranchSelectionOptions Component
 * Şube seçim seçenekleri (AI, En Yakın, Serbest) - Fade effect'li
 * Branch selection options (AI, Nearest, Free Choice) - With fade effect
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedOption - Seçili opsiyon / Selected option ('ai', 'nearest', 'free')
 * @param {Function} props.onOptionChange - Opsiyon değişiklik handler / Option change handler
 * @param {string} props.aiRecommendation - AI önerisi / AI recommendation
 * @param {string} props.nearestBranch - En yakın şube / Nearest branch
 * @param {string} props.freeChoice - Serbest seçim / Free choice
 * @param {Function} props.onFreeChoiceChange - Serbest seçim değişiklik / Free choice change
 * @param {Array} props.branches - Tüm şubeler listesi / All branches list
 */
const BranchSelectionOptions = ({
    selectedOption,
    onOptionChange,
    aiRecommendation,
    nearestBranch,
    freeChoice,
    onFreeChoiceChange,
    branches = []
}) => {
    return (
        <Card 
            elevation={0} 
            sx={{ 
                bgcolor: 'grey.50', 
                mb: 3,
                border: '1px solid',
                borderColor: 'grey.200'
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold">
                        Şube Transfer Seçeneği Belirleyin
                    </Typography>
                </Box>

                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={selectedOption}
                        onChange={(e) => onOptionChange(e.target.value)}
                    >
                        {/* AI Önerisi */}
                        <Box
                            sx={{
                                p: 2.5,
                                mb: 2,
                                borderRadius: 3,
                                background: selectedOption === 'ai' 
                                    ? 'linear-gradient(135deg, rgba(30, 136, 229, 0.15) 0%, rgba(66, 165, 245, 0.15) 100%)'
                                    : 'background.paper',
                                border: 2,
                                borderColor: selectedOption === 'ai' ? 'primary.main' : 'divider',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: selectedOption && selectedOption !== 'ai' ? 0.5 : 1,
                                filter: selectedOption && selectedOption !== 'ai' ? 'grayscale(0.8)' : 'none',
                                transform: selectedOption === 'ai' ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: selectedOption === 'ai' ? '0 8px 24px rgba(30, 136, 229, 0.2)' : 'none',
                                '&:hover': {
                                    opacity: selectedOption && selectedOption !== 'ai' ? 0.7 : 1,
                                    transform: selectedOption === 'ai' ? 'scale(1.02)' : 'scale(1.01)'
                                },
                                position: 'relative'
                            }}
                        >
                            {selectedOption === 'ai' && (
                                <CheckCircleIcon
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        color: 'primary.main',
                                        fontSize: 28
                                    }}
                                />
                            )}
                            <FormControlLabel
                                value="ai"
                                control={<Radio disabled={!aiRecommendation} />}
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold" color={selectedOption === 'ai' ? 'primary.dark' : 'text.primary'}>
                                            🤖 Yapay Zeka Önerisi
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color={aiRecommendation ? 'text.primary' : 'text.disabled'}
                                            sx={{ mt: 0.5, fontWeight: selectedOption === 'ai' ? 600 : 400 }}
                                        >
                                            {aiRecommendation || 'Öneri alınmadı'}
                                        </Typography>
                                    </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                            />
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* En Yakın Şube */}
                        <Box
                            sx={{
                                p: 2.5,
                                mb: 2,
                                borderRadius: 3,
                                background: selectedOption === 'nearest'
                                    ? 'linear-gradient(135deg, rgba(30, 136, 229, 0.15) 0%, rgba(66, 165, 245, 0.15) 100%)'
                                    : 'background.paper',
                                border: 2,
                                borderColor: selectedOption === 'nearest' ? 'primary.main' : 'divider',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: selectedOption && selectedOption !== 'nearest' ? 0.5 : 1,
                                filter: selectedOption && selectedOption !== 'nearest' ? 'grayscale(0.8)' : 'none',
                                transform: selectedOption === 'nearest' ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: selectedOption === 'nearest' ? '0 8px 24px rgba(0, 211, 149, 0.2)' : 'none',
                                '&:hover': {
                                    opacity: selectedOption && selectedOption !== 'nearest' ? 0.7 : 1,
                                    transform: selectedOption === 'nearest' ? 'scale(1.02)' : 'scale(1.01)'
                                },
                                position: 'relative'
                            }}
                        >
                            {selectedOption === 'nearest' && (
                                <CheckCircleIcon
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        color: 'primary.main',
                                        fontSize: 28
                                    }}
                                />
                            )}
                            <FormControlLabel
                                value="nearest"
                                control={<Radio disabled={!nearestBranch} />}
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold" color={selectedOption === 'nearest' ? 'primary.dark' : 'text.primary'}>
                                            📍 En Kısa Mesafedeki Şube
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color={nearestBranch ? 'text.primary' : 'text.disabled'}
                                            sx={{ mt: 0.5, fontWeight: selectedOption === 'nearest' ? 600 : 400 }}
                                        >
                                            {nearestBranch || 'Hesaplanmadı'}
                                        </Typography>
                                    </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                            />
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Serbest Seçim */}
                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                background: selectedOption === 'free'
                                    ? 'linear-gradient(135deg, rgba(30, 136, 229, 0.15) 0%, rgba(66, 165, 245, 0.15) 100%)'
                                    : 'background.paper',
                                border: 2,
                                borderColor: selectedOption === 'free' ? 'primary.main' : 'divider',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: selectedOption && selectedOption !== 'free' ? 0.5 : 1,
                                filter: selectedOption && selectedOption !== 'free' ? 'grayscale(0.8)' : 'none',
                                transform: selectedOption === 'free' ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: selectedOption === 'free' ? '0 8px 24px rgba(108, 99, 255, 0.2)' : 'none',
                                '&:hover': {
                                    opacity: selectedOption && selectedOption !== 'free' ? 0.7 : 1,
                                    transform: selectedOption === 'free' ? 'scale(1.02)' : 'scale(1.01)'
                                },
                                position: 'relative'
                            }}
                        >
                            {selectedOption === 'free' && (
                                <CheckCircleIcon
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        color: 'primary.main',
                                        fontSize: 28
                                    }}
                                />
                            )}
                            <FormControlLabel
                                value="free"
                                control={<Radio />}
                                label={
                                    <Typography variant="body1" fontWeight="bold" color={selectedOption === 'free' ? 'primary.dark' : 'text.primary'}>
                                        🎯 Serbest Şube Seçimi
                                    </Typography>
                                }
                                sx={{ width: '100%', m: 0, mb: selectedOption === 'free' ? 2 : 0 }}
                            />

                            {selectedOption === 'free' && (
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <Select
                                        value={freeChoice}
                                        onChange={(e) => onFreeChoiceChange(e.target.value)}
                                        displayEmpty
                                        size="small"
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                            fontWeight: 600,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                borderWidth: 2
                                            }
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Bir şube seçin...</em>
                                        </MenuItem>
                                        {branches.map((branch) => (
                                            <MenuItem key={branch.isim} value={branch.isim}>
                                                {branch.isim}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </RadioGroup>
                </FormControl>
            </CardContent>
        </Card>
    );
};

export default BranchSelectionOptions;
