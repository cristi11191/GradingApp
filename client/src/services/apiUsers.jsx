import api from "./api.jsx";
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
export const updateRole = async (userId, newRole) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(
            `${API_URL}/role`,
            { userId, newRole },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error.response?.data || "Failed to update user role";
    }
};
export const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`${API_URL}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { userId },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error.response?.data || "Failed to delete user";
    }
};
