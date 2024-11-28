// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProjectForm from "./EditProjectForm.jsx";
import CollaboratorsList from "./CollaboratorsList.jsx";
import DeliverablesList from "./DeliverablesList.jsx";
import EvaluationsList from "./EvaluationsList.jsx";
import './MyProject.css';

const MyProject = () => {
    const [project, setProject] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // Stare pentru creare proiect


    useEffect(() => {
        axios.get("/api/project")
            .then((response) => {
                if (!response.data) {
                    setProject(null); // Setează null dacă nu există proiect
                } else {
                    setProject(response.data);
                    //setProject(null);
                }
            })
            .catch((error) => {
                console.error("Error fetching project data:", error);
                setProject(null); // Dacă apare eroare, setează null
            });
    }, []);

    const handleSave = (updatedProject) => {
        axios.post("/api/project", updatedProject) // Create or update project
            .then((response) => {
                setProject(response.data);
                setIsEditing(false);
                setIsCreating(false);
            })
            .catch((error) => {
                console.error("Error saving project:", error);
                setIsEditing(false);
                setIsCreating(false);
            });
    };

    const handleAddProject = () => {
        setProject({}); // Inițializează un proiect gol pentru creare
        setIsCreating(true); // Activează formularul de creare
    };

    const existProject = (!project || Object.keys(project || {}).length === 0);

    return (
        <div className="my-project-container">
            {existProject ? (
                <div className="no-project">
                    <p>No project available. Start by creating one!</p>
                    <button className="btnAdd" onClick={handleAddProject}>Add Project</button>
                </div>
            ) : (
                <div className="my-project">
                    <h1 className="my-project-text">My Project</h1>
                    {(isEditing || isCreating)? (
                        <EditProjectForm
                            project={project || {}}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsEditing(false);
                                setIsCreating(false);
                            }} />
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
                            <DeliverablesList deliverables={project.deliverables} projectId={project.id} />

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
