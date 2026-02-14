// Recommendation Slice (Redux Toolkit)
// AI öneri state yönetimi
// AI recommendation state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Initial State
 * Başlangıç durumu
 */
const initialState = {
    // Öneri verileri
    recommendation: null,   // AI önerisi { oneri, aciklama, enYakin }
    requestParams: null,    // Son istek parametreleri { il, konum, secimler }
    
    // Durum bilgileri
    isLoading: false,
    error: null,
    
    // UI state
    selectedPreferences: []  // Kullanıcının seçtiği tercihler
};

/**
 * Async Thunk: AI Önerisi Al
 * Get AI Recommendation
 */
export const getRecommendation = createAsyncThunk(
    'recommendation/get',
    async ({ il, konum, secimler }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/gemini`, {
                il,
                konum,
                secimler
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            
            return {
                recommendation: response.data,
                requestParams: { il, konum, secimler }
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.mesaj || 
                'AI önerisi alınamadı'
            );
        }
    }
);

/**
 * Recommendation Slice
 * Öneri state yönetimi
 */
const recommendationSlice = createSlice({
    name: 'recommendation',
    initialState,
    reducers: {
        // Tercihleri güncelle
        setPreferences: (state, action) => {
            state.selectedPreferences = action.payload;
        },
        
        // Tek tercih ekle/çıkar (toggle)
        togglePreference: (state, action) => {
            const preference = action.payload;
            const index = state.selectedPreferences.indexOf(preference);
            
            if (index > -1) {
                // Varsa çıkar
                state.selectedPreferences.splice(index, 1);
            } else {
                // Yoksa ekle
                state.selectedPreferences.push(preference);
            }
        },
        
        // Tüm tercihleri temizle
        clearPreferences: (state) => {
            state.selectedPreferences = [];
        },
        
        // Öneriyi temizle
        clearRecommendation: (state) => {
            state.recommendation = null;
            state.requestParams = null;
            state.error = null;
        },
        
        // Hata temizleme
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRecommendation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getRecommendation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recommendation = action.payload.recommendation;
                state.requestParams = action.payload.requestParams;
                state.error = null;
            })
            .addCase(getRecommendation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

// Actions
export const {
    setPreferences,
    togglePreference,
    clearPreferences,
    clearRecommendation,
    clearError
} = recommendationSlice.actions;

// Selectors
export const selectRecommendation = (state) => state.recommendation.recommendation;
export const selectRequestParams = (state) => state.recommendation.requestParams;
export const selectSelectedPreferences = (state) => state.recommendation.selectedPreferences;
export const selectIsLoading = (state) => state.recommendation.isLoading;
export const selectError = (state) => state.recommendation.error;

export default recommendationSlice.reducer;
