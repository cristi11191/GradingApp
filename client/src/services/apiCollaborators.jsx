// src/api/apiCollaborators.jsx
import api from "./api.jsx";
const API_URL = import.meta.env.VITE_API_URL+'/api/collaborator';
/**
 * Check if a collaborator exists by email.
 * @param {string} email - The email of the collaborator to check.
 * @returns {Promise<string>} "existent" if the collaborator exists, "inexistent" otherwise.
 */
export const checkCollaboratorExists = async (email) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`${API_URL}/exists`, {

            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { email },
        });
        return response.data.exists ? "existent" : "inexistent"; // Return "existent" or "inexistent" based on response
    } catch (error) {
        console.error("Error checking collaborator existence:", error);
        throw error.response?.data || "Failed to check collaborator existence"; // Forward the error
    }
};

/**
 * Verifică disponibilitatea unui grup de colaboratori pe baza email-urilor.
 * @param {Array<string>} emails - Lista de email-uri ale colaboratorilor.
 * @returns {Promise<Object>} - Obiect care conține email-urile și disponibilitatea lor (true/false).
 */
export const checkCollaboratorsAvailability = async (emails) => {
    try {
        const token = localStorage.getItem("token");

        // Trimitem lista de email-uri pentru verificare disponibilitate
        const response = await api.post(`${API_URL}/checkAvailability`, {
            emails: emails
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Returnăm obiectul cu disponibilitatea colaboratorilor
        return response.data;
    } catch (error) {
        console.error("Error checking collaborators availability:", error);
        throw error.response?.data || "Failed to check collaborators availability"; // Forward the error
    }
};