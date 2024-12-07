import React from "react";
import "./MyProjectCard.css";

const MyProjectCard = ({ project }) => {
    const isProjectValid = project && project.title && project.description && project.deadline;

    return (
        <div className="card my-project-card">
            <h2>My Project</h2>
            {isProjectValid ? (
                <div className="project-details">
                    <p>Title: {project.title}</p>
                    <p>Description: {project.description}</p>
                    <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                </div>
            ) : (
                <div className="no-project">No project available.</div>
            )}
        </div>
    );
};

export default MyProjectCard;
