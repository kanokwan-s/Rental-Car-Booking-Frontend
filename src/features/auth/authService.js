import axios from "axios"

const API_URL="http://localhost:5000/api/v1/auth/"

// Helper function to process user data
const processUserData = (data) => {
    if (!data) return null;
    
    // ตรวจสอบว่าข้อมูลเป็น object<|im_start|>ไม่
    if (typeof data !== 'object') {
        return {
            name: data,
            role: 'user'
        };
    }
    
    // ตรวจสอบให้แน่ใจว่า<|im_start|> role ทนส่งมา
    return {
        ...data,
        role: data.role || 'user' // ถ้าไม่ทน role ให้เป็น user
    };
}

//Register user
const register = async (userData) => {
    try {
        console.log('Sending registration data:', userData);
        const response = await axios.post(API_URL + 'register/', userData);
        
        if (response.data) {
            const processedData = processUserData(response.data);
            localStorage.setItem('user', JSON.stringify(processedData));
            return processedData;
        }
    } catch (error) {
        // Log the error response for debugging
        console.error('Registration error:', error.response?.data || error.message);
        throw error; // Re-throw to be handled by the thunk
    }
}

//Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)
    if(response.data) {
        console.log('Raw response data:', response.data); // Add this line to debug
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    }
    return response.data;
}

//Logout user
const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    logout,
    login,
}

export default authService
