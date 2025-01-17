import React, {useEffect, useState} from "react";
import './AdminDashboard.css';
import {getCounts} from "../../services/apiDashboard.jsx";

const AdminDashboard = () => {
    const [users,setUsers] = useState(null);
    const [projects, setProjects] = useState(null);
    const [files, setFiles] = useState(null);
    const [evaluations, setEvaluations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await getCounts();
                setUsers(data.users);
                setProjects(data.projects);
                setFiles(data.deliverables);
                setEvaluations(data.evaluations);
            } catch (err) {
                setError("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container2">
            <div className="projects-container2">
                <div className="project-card2">
                    <h3>Users</h3>
                    <p>{users}</p>
                </div>
                <div className="project-card2">
                    <h3>Projects</h3>
                    <p>{projects}</p>
                </div>
                <div className="project-card2">
                    <h3>Files</h3>
                    <p>{files}</p>
                </div>
                <div className="project-card2">
                    <h3>Evaluations</h3>
                    <p>{evaluations}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;