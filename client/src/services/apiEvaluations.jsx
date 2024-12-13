// src/api/apiEvaluations.jsx
import api from "./api.jsx";  // Assuming 'api' is a pre-configured axios instance

// Define the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL + '/api/evaluation';

/**
 * Fetch evaluations by project ID.
 * @param {number} projectId - The ID of the project for which evaluations are fetched.
 * @returns {Promise<Array>} List of evaluations for the given project.
 */
export const fetchEvaluationsByProjectId = async (projectId) => {
    try {
        const token = localStorage.getItem("token"); // Get JWT token stored locally
        const response = await api.get(`${API_URL}/project/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the evaluations data
    } catch (error) {
        console.error("Error fetching evaluations:", error);
        throw error.response?.data || "Failed to fetch evaluations"; // Forward the error for handling
    }
};

/**
 * Fetch evaluations by user ID.
 * @returns {Promise<Array>} List of evaluations for the given user.
 */
export const fetchEvaluationsByUserId = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`${API_URL}/user/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.evaluations || response.data;
    } catch (error) {
        console.error("Error fetching evaluations by user ID:", error);
        throw error.response?.data || "Failed to fetch evaluations by user ID";
    }
};

/**
 * Create a new evaluation for a project.
 * @param {number} projectId - The ID of the project.
 * @param {object} evaluationData - The evaluation data (e.g., score, comments).
 * @returns {Promise<object>} Created evaluation data.
 */
export const createEvaluation = async (projectId, evaluationData) => {
    try {
        const token = localStorage.getItem("token"); // Get JWT token stored locally
        const response = await api.post(`${API_URL}/create/${projectId}`, evaluationData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the created evaluation data
    } catch (error) {
        console.error("Error creating evaluation:", error);
        throw error.response?.data || "Failed to create evaluation"; // Forward the error for handling
    }
};

/**
 * Update an existing evaluation.
 * @param {number} evaluationId - The ID of the evaluation to update.
 * @param {object} evaluationData - The updated evaluation data.
 * @returns {Promise<object>} Updated evaluation data.
 */
export const updateEvaluation = async (evaluationId, evaluationData) => {
    try {
        const token = localStorage.getItem("token"); // Get JWT token stored locally
        const response = await api.put(`${API_URL}/update/${evaluationId}`, evaluationData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the updated evaluation data
    } catch (error) {
        console.error("Error updating evaluation:", error);
        throw error.response?.data || "Failed to update evaluation"; // Forward the error for handling
    }
};

/**
 * Delete an existing evaluation.
 * @param {number} evaluationId - The ID of the evaluation to delete.
 * @returns {Promise<object>} Response message.
 */
export const deleteEvaluation = async (evaluationId) => {
    try {
        const token = localStorage.getItem("token"); // Get JWT token stored locally
        const response = await api.delete(`${API_URL}/delete/${evaluationId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response; // Return success message
    } catch (error) {
        console.error("Error deleting evaluation:", error);
        throw error.response?.data || "Failed to delete evaluation"; // Forward the error for handling
    }
};
