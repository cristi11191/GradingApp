import React, { useEffect, useState } from 'react';
import { fetchProjectById } from '../../services/apiProject'; // Importă funcția
import { useParams } from 'react-router-dom';
import EditProjectForm from "../MyProject/EditProjectForm.jsx";
import CollaboratorsList from "../MyProject/CollaboratorsList.jsx";
import EvaluationsList from "../MyProject/EvaluationsList.jsx"; // Folosim useParams pentru a extrage ID-ul proiectului

const ProjectDetails = () => {
    const { projectId } = useParams(); // Extrage ID-ul proiectului din URL
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectData = await fetchProjectById(projectId); // Obține detaliile proiectului
                setProject(projectData.project);
            } catch (err) {
                setError('Failed to load project details.');
            }
        };
        if (projectId) {
            fetchProjectDetails();
        }

    }, [projectId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!project) {
        return <p>Loading project details...</p>;
    }

    const downloadAttachment = async (filename) => {
        if (!filename) {
            console.error("No filename provided for download.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/files/download/${filename}`);

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
        <div className={`my-project-container 'no-project-background' : ''}`}>

                <div className="my-project">
                    <h1 className="my-project-text">My Project</h1>

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


                        </>
                </div>

        </div>
    );
};

export default ProjectDetails;
