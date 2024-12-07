import axios from "axios";

export const fetchRecentProjects = async () => {
    const response = await axios.get("/api/projects");
    return Array.isArray(response.data) ? response.data : [];
};


export const fetchRecentEvaluations = async () => {
    const response = await axios.get("/api/evaluations");
    return Array.isArray(response.data) ? response.data : [];
};


export const fetchNotifications = async () => {
    const response = await axios.get("/api/notifications");
    return Array.isArray(response.data) ? response.data : [];
};


export const fetchQuickStats = async () => {
    const response = await axios.get("/api/quick-stats");
    return response.data;
};

export const fetchMyProject = async () => {
    const response = await axios.get("/api/my-project");
    return response.data;
};
