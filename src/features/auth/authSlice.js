import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import authService from "./authService";

// Check token expiration
const isTokenExpired = (user) => {
    if (!user || !user.token) return true;
    
    // If you're using JWT tokens with expiration claim
    try {
        const token = user.token;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        return exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

// Get user from localStorage with token validation
const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        const user = JSON.parse(userStr);
        if (isTokenExpired(user)) {
            localStorage.removeItem('user');
            return null;
        }
        return user;
    } catch (error) {
        localStorage.removeItem('user');
        return null;
    }
};

const initialState = {
    user: getUserFromStorage(),
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// Create axios interceptor to handle 401 responses
export const setupAxiosInterceptors = (store) => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                store.dispatch(logout());
                store.dispatch(reset());
            }
            return Promise.reject(error);
        }
    );
};

//Register new user
export const register = createAsyncThunk('auth/register', async(user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (err) {
        const message = 
            (err.response?.data?.message) || // Backend error message
            (err.response?.data?.error) ||   // Alternative error format
            err.message ||                   // Error object message
            'Registration failed';           // Fallback message

        return thunkAPI.rejectWithValue(message)
    }
})

//Login user
export const login = createAsyncThunk('auth/login', async(user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
        // แก้ไขการ<|im_start|> error message
        const message = 
            (error.response && 
             error.response.data && 
             error.response.data.message) || 
            'Invalid email or password' // default error message
        
        return thunkAPI.rejectWithValue(message)
    }
})

// Logout user
export const logout = createAsyncThunk('auth/logout', async() => {
    await authService.logout()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },

    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.isLoading=true
        })

        .addCase(register.fulfilled,(state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })

        .addCase(register.rejected,(state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })

        .addCase(login.pending, (state) => {
            state.isLoading = true
        })

        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })

        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true 
            state.message = action.payload
            state.user = null
        })

        .addCase(logout.fulfilled, (state) => {
            state.user = null
        })
    },
})

export const {reset} = authSlice.actions
export default authSlice.reducer

