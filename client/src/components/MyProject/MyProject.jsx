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

    return (
        <div className="my-project-container">
            {!existProject ? (
                <div className="no-project">
                    <p>No project available. Start by creating one!</p>
                    <button className="btnAdd" onClick={handleAddProject}>Add Project</button>
                </div>
            ) : (
                <div className="my-project">
                    <h1 className="my-project-text">My Project</h1>
                    {(isEditing || isCreating)? (
                        <EditProjectForm
                            open={true}
                            project={project || {}}
                            onCancel={() => {
                                {isCreating ? setProject(null): setIsCreating(false)}
                                setIsEditing(false);
                                setIsCreating(false);
                            }}
                            currentUserEmail={currentUserEmail}
                        />
                    ) : (
                        <>
                            <h2>{project.title}</h2>
                            <p>{project.description}</p>
                            {project.attachmentURL && (
                                <p>
                                    Attachment: <a href={project.attachmentURL} target="_blank" rel="noopener noreferrer">View</a>
                                </p>
                            )}
                            <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                            <button className="btnEdit" onClick={() => setIsEditing(true)}>Edit Project</button>

                            <h3>Collaborators</h3>
                            <CollaboratorsList collaborators={project.collaborators} projectId={project.id} />

                            <h3>Deliverables</h3>
                            <DeliverablesList deliverables={project.deliverables || []} projectId={project.id} />

                            <h3>Evaluations</h3>
                            <EvaluationsList evaluations={project.evaluations} projectId={project.id} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyProject;