import axios from "axios";
import api from "./api.jsx";
const API_URL = import.meta.env.VITE_API_URL+'/api';

export const fetchRecentProjects = async () => {
    const response = await api.get("/api/projects");
    return Array.isArray(response.data) ? response.data : [];
};


export const fetchRecentEvaluations = async () => {
    const response = await api.get("/api/evaluations");
    return Array.isArray(response.data) ? response.data : [];
};


export const fetchNotifications = async () => {
    const response = await api.get("/api/notifications");
    return Array.isArray(response.data) ? response.data : [];
};


export const fetchQuickStats = async () => {
    const response = await api.get("/api/quick-stats");
    return response.data;
};

export const fetchMyProject = async () => {
    const response = await api.get("/api/my-project");
    return response.data;
};

export const getCounts = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`${API_URL}/counts`, {

            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return "existent" or "inexistent" based on response
    } catch (error) {
        console.error("Error checking collaborator existence:", error);
        throw error.response?.data || "Failed to check collaborator existence"; // Forward the error
    }
};
