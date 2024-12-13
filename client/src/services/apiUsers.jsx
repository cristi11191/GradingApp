import api from "./api.jsx";
import {useEffect} from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL+'/api/user';

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`${API_URL}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error retrieving all users:", error);
        throw error.response?.data || "Failed to retrieve all users";
    }
};