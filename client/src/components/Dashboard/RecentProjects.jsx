import React, {useEffect, useState} from "react";
import {fetchEvaluationsByUserId} from "../../services/apiEvaluations.jsx";
import {fetchAllProjects} from "../../services/apiProject.jsx";

const RecentProjects = () => {

    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const projects = await fetchAllProjects();
            setProjects(projects);
        };
        fetchData();
    }, []);

    if (!Array.isArray(projects)) {
         return <div className="card"><h2>Recent Projects</h2><p>No projects available.</p></div>;
    }

    return (
        <div className="card">
            <h2>Recent Projects</h2>
            <ul>
                {projects.map((project, index) => (
                    <li key={index}>
                        {project.title} - {project.deadline
                        ? new Intl.DateTimeFormat('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).format(new Date(project.deadline))
                        : 'No deadline specified'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentProjects;
