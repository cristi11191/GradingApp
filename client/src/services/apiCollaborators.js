// src/api/apiCollaborators.jsx
import api from "./api.js";
const API_URL = import.meta.env.VITE_API_URL+'/api/collaborators';
/**
 * Check if a collaborator exists by email.
 * @param {string} email - The email of the collaborator to check.
 * @returns {Promise<string>} "existent" if the collaborator exists, "inexistent" otherwise.
 */
export const checkCollaboratorExists = async (email) => {
    try {
        const response = await api.get(`${API_URL}/exists`, {
            params: { email },
        });
        return response.data.exists ? "existent" : "inexistent"; // Return "existent" or "inexistent" based on response
    } catch (error) {
        console.error("Error checking collaborator existence:", error);
        throw error.response?.data || "Failed to check collaborator existence"; // Forward the error
    }
};
