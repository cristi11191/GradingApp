// File: MyProject.jsx
import React, { useState, useEffect } from "react";
import EditProjectForm from "./EditProjectForm.jsx";
import CollaboratorsList from "./CollaboratorsList.jsx";
import EvaluationsList from "./EvaluationsList.jsx";
import './MyProject.css';
import { jwtDecode } from "jwt-decode";
import { fetchProjectByCollaboratorEmail, deleteProject } from "../../services/apiProject";

/**
 * Componentă pentru vizualizarea unui videoclip într-un pop-up.
 */
const VideoPopup = ({ videoURL, onClose, onDownload }) => (
    <div className="video-popup">
        <div className="video-popup-content">
            <video controls className="video-element">
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="video-popup-buttons">
                <button className="btnDownload" onClick={() => onDownload(videoURL)}>
                    Download
                </button>
                <button className="btnClose" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    </div>
);

const getEmailFromToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const MyProject = () => {
    const [project, setProject] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [videoToWatch, setVideoToWatch] = useState(null); // Video pentru pop-up
    const BASE_URL = "http://localhost:5000"; //
    const videoURL = `${BASE_URL}${videoToWatch}`;


    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projectData = await fetchProjectByCollaboratorEmail();
                setProject(projectData.length === 0 ? null : projectData);
            } catch (error) {
                setProject(null);
            }
        };

        fetchProject();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleAddProject = () => {
        setProject({});
        setIsCreating(true);
    };

    const handleSave = (updatedProject) => {
        setProject(updatedProject);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleDeleteSuccess = () => {
        alert('Project deleted successfully!');
        setProject(null);
    };

    const downloadAttachment = async (filename) => {
        if (!filename) {
            console.error("No filename provided for download.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/files/download/${filename}`);
            if (!response.ok) throw new Error("Failed to download file");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Error during download:", error);
        }
    };

    const isVideoFile = (filename) => {
        const videoExtensions = ['mp4', 'webm', 'ogg'];
        const extension = filename.split('.').pop().toLowerCase();
        return videoExtensions.includes(extension);
    };

    return (
        <div className={`my-project-container ${!project ? 'no-project-background' : ''}`}>
            {!project ? (
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
                        />
                    ) : (
                        <>
                            <h2>Title: {project.title}</h2>
                            <p>Description: {project.description}</p>
                            <h3>Collaborators</h3>
                            <CollaboratorsList collaborators={project.collaborators} projectId={project.id}/>

                            {project.deliverables && project.deliverables.length > 0 && (
                                <div className="deliverables-section">
                                    <h3>Deliverables:</h3>
                                    <ul>
                                        {project.deliverables.map((deliverable, index) => (
                                            <li key={index}>
                                                <span>{deliverable.attachmentURL.split('/').pop()}</span>
                                                {isVideoFile(deliverable.attachmentURL) ? (
                                                    <button
                                                        className="btnWatch"
                                                        onClick={() => setVideoToWatch(`${BASE_URL}${deliverable.attachmentURL}`)}
                                                    >
                                                        Watch
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btnDownload"
                                                        onClick={() => downloadAttachment(deliverable.attachmentURL.split('/').pop())}
                                                    >
                                                        Download
                                                    </button>
                                                )}
                                            </li>
                                        ))}

                                        {/* Afișează URL-urile salvate */}
                                        {project.attachmentURL && project.attachmentURL.length > 0 && (
                                            <div className="urls-section">
                                                <h3>URLs:</h3>
                                                <ul>
                                                    {project.attachmentURL.split(",").map((url, index) => (
                                                        <li key={index}>
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="url-link"
                                                            >
                                                                {url}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}


                                    </ul>
                                </div>
                            )}
                            <h3>Evaluations:</h3>
                            <EvaluationsList evaluations={project.evaluations} projectId={project.id}/>

                            <div className="edit-button-container">
                                <button className="btnEdit" onClick={handleEdit}>
                                    Edit Project
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {videoToWatch && (
                <VideoPopup
                    videoURL={videoToWatch} // Folosește direct valoarea completă
                    onClose={() => setVideoToWatch(null)}
                    onDownload={(videoURL) => downloadAttachment(videoURL.split('/').pop())}
                />
            )}
        </div>
    );
};

export default MyProject;
