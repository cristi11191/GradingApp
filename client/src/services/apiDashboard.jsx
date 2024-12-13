import axios from "axios";
import api from "./api.jsx";

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
