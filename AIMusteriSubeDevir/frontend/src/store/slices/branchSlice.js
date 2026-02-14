// Branch Slice (Redux Toolkit)
// Şube listesi state yönetimi
// Branch list state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Initial State
 * Başlangıç durumu
 */
const initialState = {
    // Şube verileri
    branches: [],           // Tüm şubeler listesi
    filteredBranches: [],   // Filtrelenmiş şubeler
    selectedCity: null,     // Seçili il
    
    // Durum bilgileri
    isLoading: false,
    error: null
};

/**
 * Async Thunk: Şube Listesini Getir
 * Fetch Branches List
 */
export const fetchBranches = createAsyncThunk(
    'branch/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/subeler`);
            return response.data.subeler || [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.mesaj || 
                'Şube listesi alınamadı'
            );
        }
    }
);

/**
 * Branch Slice
 * Şube state yönetimi
 */
const branchSlice = createSlice({
    name: 'branch',
    initialState,
    reducers: {
        // İle göre filtrele
        filterByCity: (state, action) => {
            const city = action.payload;
            state.selectedCity = city;
            
            if (!city) {
                state.filteredBranches = state.branches;
            } else {
                state.filteredBranches = state.branches.filter(
                    branch => branch.il === city || branch.komsuIllerIcin === true
                );
            }
        },
        
        // Filtreyi temizle
        clearFilter: (state) => {
            state.selectedCity = null;
            state.filteredBranches = state.branches;
        },
        
        // Hata temizleme
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranches.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.isLoading = false;
                state.branches = action.payload;
                state.filteredBranches = action.payload;
                state.error = null;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

// Actions
export const { filterByCity, clearFilter, clearError } = branchSlice.actions;

// Selectors
export const selectBranches = (state) => state.branch.branches;
export const selectFilteredBranches = (state) => state.branch.filteredBranches;
export const selectSelectedCity = (state) => state.branch.selectedCity;
export const selectIsLoading = (state) => state.branch.isLoading;
export const selectError = (state) => state.branch.error;

export default branchSlice.reducer;
