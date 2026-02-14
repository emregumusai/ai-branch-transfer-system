// Auth Slice (Redux Toolkit)
// Kullanıcı kimlik doğrulama state yönetimi
// User authentication state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Initial State
 * Başlangıç durumu
 */
const initialState = {
    // Kullanıcı bilgileri
    user: null,          // { adSoyad, sube }
    girisBilgisi: null,  // TC veya kullanıcı adı
    
    // Durum bilgileri
    isLoading: false,
    isAuthenticated: false,
    error: null
};

/**
 * Async Thunk: Kullanıcı Girişi
 * User Login
 */
export const loginUser = createAsyncThunk(
    'auth/login',
    async (girisBilgisi, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/giris`, {
                girisBilgisi
            });
            
            if (response.data.basarili) {
                return {
                    user: {
                        adSoyad: response.data.adSoyad,
                        sube: response.data.sube
                    },
                    girisBilgisi
                };
            } else {
                return rejectWithValue(response.data.mesaj || 'Giriş başarısız');
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.mesaj || 
                'Sunucuya bağlanılamadı'
            );
        }
    }
);

/**
 * Async Thunk: Şube Güncelleme
 * Update Branch
 */
export const updateBranch = createAsyncThunk(
    'auth/updateBranch',
    async ({ girisBilgisi, yeniSube }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/sube-guncelle`, {
                girisBilgisi,
                yeniSube
            });
            
            if (response.data.basarili) {
                return yeniSube;
            } else {
                return rejectWithValue(response.data.mesaj || 'Güncelleme başarısız');
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.mesaj || 
                'Şube güncellenemedi'
            );
        }
    }
);

/**
 * Auth Slice
 * Kimlik doğrulama state yönetimi
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Kullanıcı çıkışı
        logout: (state) => {
            state.user = null;
            state.girisBilgisi = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        
        // Hata temizleme
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // ===== LOGIN =====
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.girisBilgisi = action.payload.girisBilgisi;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            });
        
        // ===== UPDATE BRANCH =====
        builder
            .addCase(updateBranch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBranch.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.user) {
                    state.user.sube = action.payload;
                }
                state.error = null;
            })
            .addCase(updateBranch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

// Actions
export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectGirisBilgisi = (state) => state.auth.girisBilgisi;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;
