import React, { useEffect, useState } from "react";
import { fetchAllProjects } from "../../services/apiProject.jsx";
import "./RecentProjects.css";

const RecentProjects = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allProjects = await fetchAllProjects();
                const currentDate = new Date(); // Data curentă

                // Filtrăm proiectele cu un deadline valid și ulterior datei curente
                const upcomingProjects = allProjects
                    .filter(
                        (project) =>
                            project.deadline && new Date(project.deadline) >= currentDate
                    )
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Sortare crescătoare

                setProjects(upcomingProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError("Failed to load projects.");
            }
        };

        fetchData();
    }, []);

    if (error) {
        return (
            <div className="card">
                <h2>Recent Projects</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!Array.isArray(projects) || projects.length === 0) {
        return (
            <div className="card">
                <h2>Recent Projects</h2>
                <p>No upcoming projects available.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>Recent Projects</h2>
            <ul className="recent-projects-list">
                {projects.slice(0, 3).map((project, index) => (
                    <li key={index} className="recent-project-item">
                        <div className="project-title">{project.title}</div>
                        <div className="project-deadline">
                            Deadline:{" "}
                            {project.deadline
                                ? new Intl.DateTimeFormat("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }).format(new Date(project.deadline))
                                : "No deadline specified"}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentProjects;
