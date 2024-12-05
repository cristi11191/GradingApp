// src/api/apiProject.jsx
import api from "./api.jsx";
import {useEffect} from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL+'/api/project';
/**
 * Fetch a single project by ID.
 * @param {number} projectId
 * @returns {Promise<object>} Project details.
 */
export const fetchProjectById = async (projectId) => {
    try {
        const token = localStorage.getItem("token"); // Obține JWT-ul stocat local
        const response = await api.get(`${API_URL}/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the project data
    } catch (error) {
        console.error("Error fetching project:", error);
        throw error.response?.data || "Failed to fetch project"; // Forward the error for handling
    }
};

/**
 * Fetch a project by the email of the collaborator.
 * @returns {Promise<object>} Project details.
 */

export const fetchProjectByCollaboratorEmail = async () => {
    try {
        const token = localStorage.getItem("token"); // Obține JWT-ul stocat local
        const response = await api.get(`${API_URL}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Returnează datele proiectului
    } catch (error) {
        throw error.response?.data || "Failed to fetch project"; // Forward the error
    }
};


/**
 * Create a new project.
 * @param {FormData} formData - Form data including title, description, files, etc.
 * @returns {Promise<object>} Created project data.
 */
export const createProject = async (formData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(`${API_URL}/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
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
        const token = localStorage.getItem("token");
        const response = await api.put(`${API_URL}/${projectId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        });
        return response.data; // Return the updated project data
    } catch (error) {
        console.error("Error updating project:", error);
        throw error.response?.data || "Failed to update project"; // Forward the error for handling
    }
};

/**
 * Delete an existing project by ID.
 * @param {number} projectId - ID of the project to delete.
 * @returns {Promise<object>} Response message.
 */
export const deleteProject = async (projectId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`${API_URL}/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return success message
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error.response?.data || "Failed to delete project"; // Forward the error for handling
    }
};

/**
 * Fetch all projects from the backend.
 * @returns {Promise<Array>} List of projects.
 */
export const fetchAllProjects = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/all`, {
            headers: {Authorization: `Bearer ${token}`,
            }
        });
        return response.data.projects; // Presupunând că backend-ul returnează un obiect cu cheia `projects`
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw error; // Aruncă eroarea pentru a fi gestionată în componentă
    }
};
