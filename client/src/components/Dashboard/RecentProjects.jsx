import React, {useEffect, useState} from "react";
import {fetchEvaluationsByUserId} from "../../services/apiEvaluations.jsx";
import {fetchAllProjects} from "../../services/apiProject.jsx";

const RecentProjects = () => {

    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const projects = await fetchAllProjects();
            console.log("eval" , projects);
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
                        {project.title} - {new Date(project.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentProjects;
