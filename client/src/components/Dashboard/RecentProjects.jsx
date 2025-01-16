import React, { useEffect, useState } from "react";
import { fetchAllProjects } from "../../services/apiProject.jsx";
import "./RecentProjects.css"; // Creăm un fișier CSS separat pentru stiluri

const RecentProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projects = await fetchAllProjects();
                setProjects(projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchData();
    }, []);

    if (!Array.isArray(projects) || projects.length === 0) {
        return (
            <div className="card">
                <h2>Recent Projects</h2>
                <p>No projects available.</p>
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
