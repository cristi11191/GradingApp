import React, {useEffect, useState} from "react";
import "./MyProjectCard.css";
import {fetchProjectByCollaboratorEmail} from "../../services/apiProject.jsx";

// eslint-disable-next-line react/prop-types
const MyProjectCard = () => {
    const [project, setMyProject] = useState(null);
    const isProjectValid = project && project.title && project.description && project.deadline;



    useEffect(() => {
        const fetchData = async () => {
            const myProject = await fetchProjectByCollaboratorEmail();
            setMyProject(myProject);
        };
        fetchData();
    }, []);

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
