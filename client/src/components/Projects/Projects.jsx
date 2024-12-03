import React, { useEffect, useState } from 'react';
import { fetchAllProjects, fetchProjectById } from '../../services/apiProject'; // Importă funcția
import './Projects.css';
import { useNavigate } from 'react-router-dom';


const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Folosim React Router pentru a naviga

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsData = await fetchAllProjects(); // Folosește funcția
                setProjects(projectsData);
            } catch (error) {
                setError('Failed to load projects. Please try again later.');
            }
        };

        fetchProjects();
    }, []);

    const handleCardClick = (projectId) => {
        // Navighează la pagina de detalii a proiectului
        navigate(`/project/${projectId}`);
    };

    return (
        <div className="projects-container">
            {error && <p className="error">{error}</p>}
            {projects.length === 0 && !error ? (
                <p className="no-projects">No projects available. Please add some projects!</p>
            ) : (
                projects.map((project) => (
                    <div
                        className="project-card"
                        key={project.id}
                        onClick={() => handleCardClick(project.id)} // Când click pe card, navighează
                    >
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Projects;
