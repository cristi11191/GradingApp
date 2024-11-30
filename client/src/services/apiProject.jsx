// src/api/apiProject.jsx
import api from "./api.js";
const API_URL = import.meta.env.VITE_API_URL+'/api/projects';
/**
 * Fetch a single project by ID.
 * @param {number} projectId
 * @returns {Promise<object>} Project details.
 */
export const fetchProjectById = async (projectId) => {
    try {
        const response = await api.get(`${API_URL}/${projectId}`);
        return response.data; // Return the project data
    } catch (error) {
        console.error("Error fetching project:", error);
        throw error.response?.data || "Failed to fetch project"; // Forward the error for handling
    }
};

/**
 * Create a new project.
 * @param {FormData} formData - Form data including title, description, files, etc.
 * @returns {Promise<object>} Created project data.
 */
export const createProject = async (formData) => {
    try {
        const response = await api.post(`${API_URL}/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        });
        return response.data; // Return the created project data
    } catch (error) {
        console.error("Error creating project:", error);
        throw error.response?.data || "Failed to create project"; // Forward the error for handling
    }
};

/**
 * Update an existing project by ID.
 * @param {number} projectId - ID of the project to update.
 * @param {FormData} formData - Updated form data.
 * @returns {Promise<object>} Updated project data.
 */
export const updateProject = async (projectId, formData) => {
    try {
        const response = await api.put(`${API_URL}/${projectId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        });
        return response.data; // Return the updated project data
    } catch (error) {
        console.error("Error updating project:", error);
        throw error.response?.data || "Failed to update project"; // Forward the error for handling
    }
};
