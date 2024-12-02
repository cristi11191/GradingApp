// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProjectForm from "./EditProjectForm.jsx";
import CollaboratorsList from "./CollaboratorsList.jsx";
import DeliverablesList from "./DeliverablesList.jsx";
import EvaluationsList from "./EvaluationsList.jsx";
import './MyProject.css';
import {jwtDecode} from "jwt-decode";
import { fetchProjectByCollaboratorEmail } from "../../services/apiProject";
import { deleteProject } from '../../services/apiProject';


/**
 * Extracts the email from the JWT token.
 * @param {string} token - The JWT token.
 * @returns {string|null} The email if present in the token, or null if not found.
 */
const getEmailFromToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email || null; // Adjust based on your token's structure
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};



const MyProject = () => {
    const [project, setProject] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // Stare pentru creare proiect


    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projectData = await fetchProjectByCollaboratorEmail(); // Apelul funcției
                setProject(projectData || null); // Setează datele proiectului sau null
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setProject(null); // Dacă apare o eroare, setează null
            }
        };

        fetchProject(); // Apelează funcția
    }, []);


    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleAddProject = () => {
        setProject({});
        setIsCreating(true);
    };

    const handleSave = (updatedProject) => {
        setProject(updatedProject); // Update the project state
        setIsEditing(false);
        setIsCreating(false);
    };

    const DeleteProjectButton = ({ projectId, onDeleteSuccess }) => {
        const handleDelete = async () => {
            if (window.confirm("Are you sure you want to delete this project?")) {
                try {
                    const response = await deleteProject(projectId);
                    alert(response.message);
                    onDeleteSuccess(); // Notify parent component or refresh the list
                } catch (error) {
                    alert(error || "Failed to delete project");
                }
            }
        };

        return (
            <button onClick={handleDelete} className="btn-delete">
                    Delete Project
            </button>
        );
    };

                const existProject = (project || Object.keys(project || {}).length !== 0);
                const currentUserEmail = getEmailFromToken(localStorage.getItem("token"));

                const handleDeleteSuccess = () => {
                alert('Project deleted successfully!');
                // Redirect or refresh the project list here
            };

                const downloadAttachment = async (filename) => {
                if (!filename) {
                console.error("No filename provided for download.");
                return;
            }

                try {
                const response = await fetch(`http://localhost:5000/api/download/${filename}`);

                if (!response.ok) {
                throw new Error("Failed to download file");
            }

                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);

                // Create a temporary link to trigger the download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', filename); // Specify the downloaded file name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Revoke the blob URL to free memory
                window.URL.revokeObjectURL(downloadUrl);
            } catch (error) {
                console.error("Error during download:", error);
            }
            };


                return (
                <div className={`my-project-container ${!existProject ? 'no-project-background' : ''}`}>
                    {!existProject ? (
                        <div className="no-project">
                            <p>No project available. Start by creating one!</p>
                            <button className="btnAdd" onClick={handleAddProject}>Add Project</button>
                        </div>
                    ) : (
                        <div className="my-project">
                            <h1 className="my-project-text">My Project</h1>
                            {(isEditing || isCreating) ? (
                                <EditProjectForm
                                    open={true}
                                    project={project || {}}
                                    onSave={handleSave}
                                    onCancel={() => {
                                        isCreating ? setProject(null) : setIsCreating(false);
                                        setIsEditing(false);
                                        setIsCreating(false);
                                    }}
                                    currentUserEmail={currentUserEmail}
                                />
                            ) : (
                                <>
                                    <h2>Title: {project.title}</h2>
                                    <p>Description: {project.description}</p>
                                    <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                                    <h3>Collaborators</h3>
                                    <CollaboratorsList collaborators={project.collaborators} projectId={project.id}/>
                                    {project.attachmentURL && (
                                        <div className="attachment-section">
                                            <h3>URL-s:</h3>
                                            <ul>
                                                <li>
                                                    <span>{project.attachmentURL ? project.attachmentURL.split('/').pop() : "Unknown File"}</span>

                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    {project.deliverables && project.deliverables.length > 0 && (
                                        <div className="deliverables-section">
                                            <h3>Deliverables:</h3>
                                            <ul>
                                                {project.deliverables.map((deliverable, index) => (
                                                    <li key={index}>
                                                        <span>{deliverable.attachmentURL ? deliverable.attachmentURL.split('/').pop() : "Unknown File"}</span>
                                                        <button
                                                            className="btnDownload"
                                                            onClick={() => downloadAttachment(deliverable.attachmentURL.split('/').pop())}
                                                        >
                                                            Download
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}


                                    <h3>Evaluations</h3>
                                    <EvaluationsList evaluations={project.evaluations} projectId={project.id}/>

                                    <div className="edit-button-container">
                                        <DeleteProjectButton projectId={project.id} onDeleteSuccess={handleDeleteSuccess}/>
                                        <button className="btnEdit" onClick={handleEdit}>
                                            Edit Project
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                );
                };

                export default MyProject;