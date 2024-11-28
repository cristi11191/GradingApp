// src/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;//'http://localhost:5000';


const api = axios.create({
  baseURL: API_BASE_URL, // Replace with your API URL
});

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle 401 errors globally
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'; // Redirect to login
        }
      }
      return Promise.reject(error);
    }
);


export const validateToken = async () => {
  try {
    const response = await api.get('/validate-token', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.data.valid) {
      throw new Error('Token invalid');
    }

    return true; // Token is valid
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Token is invalid or an error occurred
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Redirect to login
    return false;
  }
};

export default api;