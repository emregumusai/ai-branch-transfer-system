// Redux Store Configuration
// Redux mağaza yapılandırması
// Redux store setup with slices

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import branchReducer from './slices/branchSlice';
import recommendationReducer from './slices/recommendationSlice';

/**
 * Redux Store
 * Tüm state yönetimi burada yapılır
 * All state management happens here
 */
const store = configureStore({
    reducer: {
        auth: authReducer,              // Kullanıcı kimlik doğrulama state'i
        branch: branchReducer,          // Şube listesi state'i
        recommendation: recommendationReducer  // AI öneri state'i
    },
    
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Serializable check - büyük objeler için kapatılabilir
            serializableCheck: false
        }),
    
    devTools: process.env.NODE_ENV !== 'production' // Production'da DevTools'u kapat
});

export default store;
