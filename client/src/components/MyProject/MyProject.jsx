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
                console.log(projectData);
                setProject(projectData || null); // Setează datele proiectului sau null
            } catch (error) {
                console.error("Error fetching project data:", error);
                setProject(null); // Dacă apare o eroare, setează null
            }
        };

        fetchProject(); // Apelează funcția
    }, []);


    const handleAddProject = () => {
        setProject({}); // Inițializează un proiect gol pentru creare
        setIsCreating(true); // Activează formularul de creare
        console.log("Setting isCreating to true");
    };

    const existProject = (project || Object.keys(project || {}).length !== 0);
    const currentUserEmail = getEmailFromToken(localStorage.getItem("token"));
    //console.log(currentUserEmail);

    const downloadAttachment = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || url.split('/').pop(); // Nume fișier sau fallback la numele din URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                            <CollaboratorsList  collaborators={project.collaborators} projectId={project.id}/>
                            {project.attachmentURL && (
                                <div className="attachment-section">
                                    <h3>Attachments:</h3>
                                    <ul>
                                        <li>
                                            <span>{project.attachmentURL ? project.attachmentURL.split('/').pop() : "Unknown File"}</span>
                                            <button
                                                className="btnDownload"
                                                onClick={() => downloadAttachment(project.attachmentURL, project.attachmentURL.split('/').pop())}
                                            >
                                                Download
                                            </button>
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
                                                <span>{deliverable.url ? deliverable.url.split('/').pop() : "Unknown File"}</span>
                                                <button
                                                    className="btnDownload"
                                                    onClick={() => downloadAttachment(deliverable.url, deliverable.url ? deliverable.url.split('/').pop() : "Unknown")}
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
                                <button className="btnEdit" onClick={() => setIsEditing(true)}>
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