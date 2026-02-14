// Welcome Screen Component (Refactored with MUI + Redux)
// Hoş geldin ekranı bileşeni (MUI + Redux ile refactor edilmiş)
// Main dashboard screen with AI recommendations and branch transfer

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Box,
    Card,
    CardContent,
    Alert
} from '@mui/material';
import {
    fetchBranches,
    selectFilteredBranches,
    selectIsLoading as selectBranchesLoading
} from '../store/slices/branchSlice';
import {
    getRecommendation,
    setPreferences,
    clearRecommendation,
    selectRecommendation,
    selectSelectedPreferences,
    selectIsLoading as selectRecommendationLoading,
    selectError
} from '../store/slices/recommendationSlice';
import {
    updateBranch,
    selectUser,
    selectGirisBilgisi,
    logout
} from '../store/slices/authSlice';
import UserGreeting from './features/UserGreeting';
import PreferenceSelector from './features/PreferenceSelector';
import AIRecommendationCard from './features/AIRecommendationCard';
import BranchSelectionOptions from './features/BranchSelectionOptions';
import SuccessMessage from './features/SuccessMessage';
import TercihSiralama from './TercihSiralama';
import Button from './common/Button';
import Loading from './common/Loading';
import ErrorAlert from './common/ErrorAlert';
import { useToast } from './common/Toast';

/**
 * WelcomeScreen Component
 * Ana dashboard ekranı - AI önerileri ve şube devri
 * Main dashboard screen - AI recommendations and branch transfer
 */
const WelcomeScreen = () => {
    // Redux state
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const girisBilgisi = useSelector(selectGirisBilgisi);
    const branches = useSelector(selectFilteredBranches);
    const recommendation = useSelector(selectRecommendation);
    const selectedPreferences = useSelector(selectSelectedPreferences);
    const isLoadingRecommendation = useSelector(selectRecommendationLoading);
    const isLoadingBranches = useSelector(selectBranchesLoading);
    const error = useSelector(selectError);

    // Toast hook
    const { showToast } = useToast();

    // Local state
    const [selectedOption, setSelectedOption] = useState('ai');
    const [freeChoice, setFreeChoice] = useState('');
    const [transferSuccess, setTransferSuccess] = useState(false);
    const [oldBranch, setOldBranch] = useState(user?.sube || '');
    const [sortingMode, setSortingMode] = useState(false);
    const [localError, setLocalError] = useState('');

    // Şubeleri yükle
    useEffect(() => {
        dispatch(fetchBranches());
    }, [dispatch]);

    /**
     * Handle Preference Change
     * Tercih değişikliklerini yönetir
     */
    const handlePreferenceChange = (newPreferences) => {
        dispatch(setPreferences(newPreferences));
        setLocalError('');
    };

    /**
     * Handle Get AI Recommendation
     * AI önerisi al
     */
    const handleGetRecommendation = () => {
        setLocalError('');

        if (selectedPreferences.length === 0) {
            setLocalError('Lütfen en az bir tercih seçiniz.');
            return;
        }

        if (selectedPreferences.length > 1) {
            // Sıralama moduna geç
            setSortingMode(true);
        } else {
            // Tek tercih varsa direkt öneri al
            dispatch(getRecommendation({
                il: 'İstanbul',
                konum: user.sube,
                secimler: selectedPreferences
            }));
        }
    };

    /**
     * Handle Sorting Confirm
     * Sıralama onaylandı
     */
    const handleSortingConfirm = (sortedPreferences) => {
        setSortingMode(false);
        dispatch(getRecommendation({
            il: 'İstanbul',
            konum: user.sube,
            secimler: sortedPreferences
        }));
    };

    /**
     * Handle Sorting Cancel
     * Sıralama iptal edildi
     */
    const handleSortingCancel = () => {
        setSortingMode(false);
        showToast(
            'Öneri alabilmek için tercihlerinizi öncelik sırasına göre sıralamalısınız.',
            'warning',
            'Sıralama Gerekli'
        );
    };

    /**
     * Handle Branch Transfer
     * Şube devri işlemini gerçekleştir
     */
    const handleBranchTransfer = async () => {
        let selectedBranch = '';

        if (selectedOption === 'ai') {
            selectedBranch = recommendation?.oneri;
        } else if (selectedOption === 'nearest') {
            selectedBranch = recommendation?.enYakin;
        } else if (selectedOption === 'free') {
            selectedBranch = freeChoice;
        }

        if (!selectedBranch) {
            setLocalError('Lütfen bir şube seçiniz.');
            return;
        }

        // Aynı şubeye transfer kontrolü
        if (selectedBranch === user.sube) {
            setLocalError('Zaten bu şubede bulunuyorsunuz.');
            return;
        }

        setOldBranch(user.sube);
        setLocalError('');

        // Redux action dispatch
        const result = await dispatch(updateBranch({
            girisBilgisi: girisBilgisi,
            yeniSube: selectedBranch
        }));

        if (result.meta.requestStatus === 'fulfilled') {
            setTransferSuccess(true);
            dispatch(clearRecommendation());
        } else {
            setLocalError(result.payload?.message || 'Şube devri başarısız oldu. Lütfen tekrar deneyin.');
        }
    };

    /**
     * Get Selected Branch
     * Seçili şubeyi döndürür
     */
    const getSelectedBranch = () => {
        if (selectedOption === 'ai') return recommendation?.oneri;
        if (selectedOption === 'nearest') return recommendation?.enYakin;
        if (selectedOption === 'free') return freeChoice;
        return '';
    };

    // Yükleniyor durumu
    if (isLoadingBranches) {
        return <Loading message="Şubeler yükleniyor..." fullScreen />;
    }

    // Kullanıcı bilgisi yoksa (güvenlik)
    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Alert severity="error">
                    Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.
                </Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 4,
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(108, 99, 255, 0.1) 100%), linear-gradient(225deg, rgba(0, 211, 149, 0.05) 0%, rgba(255, 101, 132, 0.05) 100%)',
                backgroundColor: '#F8F9FA',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(30, 136, 229, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(108, 99, 255, 0.08) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Sıralama Modali */}
                {sortingMode && (
                    <TercihSiralama
                        tercihler={selectedPreferences}
                        onSiralamaOnayla={handleSortingConfirm}
                        onIptal={handleSortingCancel}
                    />
                )}

                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 4,
                        backdropFilter: 'blur(40px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(10, 37, 64, 0.15)'
                    }}
                >
                    <CardContent sx={{ p: 4, position: 'relative' }}>
                        {/* Loading Overlay */}
                        {isLoadingRecommendation && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(4px)',
                                    zIndex: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 3
                                }}
                            >
                                <Loading message="Yapay zeka önerileri getiriliyor..." />
                            </Box>
                        )}

                        {!transferSuccess ? (
                            <>
                                {/* Kullanıcı Karşılama */}
                                <UserGreeting
                                    userName={user.adSoyad}
                                    currentBranch={user.sube}
                                />

                                {/* Hata Mesajları */}
                                {(localError || error) && (
                                    <ErrorAlert
                                        message={localError || error}
                                        title="Hata"
                                        onClose={() => {
                                            setLocalError('');
                                        }}
                                    />
                                )}

                                {/* Tercih Seçimi */}
                                <PreferenceSelector
                                    preferences={selectedPreferences}
                                    onPreferenceChange={handlePreferenceChange}
                                    disabled={isLoadingRecommendation}
                                />

                                {/* AI Önerisi Al Butonu */}
                                {selectedPreferences.length > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                        <Button
                                            size="large"
                                            onClick={handleGetRecommendation}
                                            loading={isLoadingRecommendation}
                                            disabled={selectedPreferences.length === 0}
                                        >
                                            Yapay Zeka ile Şube Öner
                                        </Button>
                                    </Box>
                                )}

                                {/* AI Öneri Kartı */}
                                {recommendation && (
                                    <AIRecommendationCard
                                        branchName={recommendation.oneri}
                                        explanation={recommendation.aciklama}
                                        nearestBranch={recommendation.enYakin}
                                    />
                                )}

                                {/* Şube Seçim Seçenekleri */}
                                {recommendation && (
                                    <>
                                        <BranchSelectionOptions
                                            selectedOption={selectedOption}
                                            onOptionChange={setSelectedOption}
                                            aiRecommendation={recommendation.oneri}
                                            nearestBranch={recommendation.enYakin}
                                            freeChoice={freeChoice}
                                            onFreeChoiceChange={setFreeChoice}
                                            branches={branches}
                                        />

                                        {/* Şube Devrini Gerçekleştir Butonu */}
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                size="large"
                                                color="success"
                                                onClick={handleBranchTransfer}
                                                disabled={!getSelectedBranch()}
                                            >
                                                Şube Devrini Gerçekleştir
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </>
                        ) : (
                            /* Başarı Mesajı */
                            <SuccessMessage
                                oldBranch={oldBranch}
                                newBranch={user.sube}
                            />
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default WelcomeScreen;
