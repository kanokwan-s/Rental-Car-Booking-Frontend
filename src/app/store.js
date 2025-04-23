import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setupAxiosInterceptors } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Setup axios interceptors
setupAxiosInterceptors(store);
