import React from "react";

const RecentProjects = ({ projects }) => {
    if (!Array.isArray(projects)) {
        return <div className="card"><h2>Recent Projects</h2><p>No projects available.</p></div>;
    }

    return (
        <div className="card">
            <h2>Recent Projects</h2>
            <ul>
                {projects.map((project, index) => (
                    <li key={index}>
                        {project.title} - {new Date(project.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentProjects;
