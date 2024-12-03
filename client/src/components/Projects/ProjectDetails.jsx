import React, { useEffect, useState } from 'react';
import { fetchProjectById } from '../../services/apiProject'; // Importă funcția
import { useParams } from 'react-router-dom'; // Folosim useParams pentru a extrage ID-ul proiectului

const ProjectDetails = () => {
    const { projectId } = useParams(); // Extrage ID-ul proiectului din URL
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectData = await fetchProjectById(projectId); // Obține detaliile proiectului
                setProject(projectData);
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

    return (
        <div>
            <h2>Title: {project.title}</h2>
            <p>Description: {project.description}</p>
            <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            <h3>Collaborators</h3>
            <ul>
                {project.collaborators.map((collaborator, index) => (
                    <li key={index}>{collaborator.email}</li>
                ))}
            </ul>

            {project.attachmentURL && (
                <div className="attachment-section">
                    <h3>URL-s:</h3>
                    <ul>
                        <li>
                            <span>{project.attachmentURL.split('/').pop()}</span>
                        </li>
                    </ul>
                </div>
            )}

            <h3>Deliverables</h3>
            <ul>
                {project.deliverables.map((deliverable, index) => (
                    <li key={index}>{deliverable.attachmentURL}</li>
                ))}
            </ul>

            <h3>Evaluations</h3>
            <ul>
                {project.evaluations.map((evaluation, index) => (
                    <li key={index}>{evaluation.feedback}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectDetails;
