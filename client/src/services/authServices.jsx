
import api from "./api.js";

const API_URL = import.meta.env.VITE_API_URL+'/api/auth';//'http://localhost:5000/api/auth'; // Update if your backend URL is different

// Function for user signup
export const signup = async (userData) => {
    try {
        const response = await api.post(`${API_URL}/signup`, userData);
        return response.data; // This will contain the user data and token
    } catch (error) {
        console.error("Error during signup:", error);
        throw error.response.data; // Forward the error to handle it in the component
    }
};

// Function for user login
export const login = async (loginData) => {
    try {
        const response = await api.post(`${API_URL}/login`, loginData);
        return response.data; // This will contain the user data and token
    } catch (error) {
        console.error("Error during login:", error);
        throw error.response.data; // Forward the error to handle it in the component
    }
};