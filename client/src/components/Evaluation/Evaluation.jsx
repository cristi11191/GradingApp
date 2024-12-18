// Evaluation.jsx
import React, { useState, useEffect } from 'react';
import { fetchEvaluationsByUserId } from "../../services/apiEvaluations.jsx";
import {fetchAllProjects} from "../../services/apiProject.jsx"; // Assuming this is the function to fetch projects
import "./Evaluation.css";
import {useNavigate} from "react-router-dom";

const Evaluation = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredEvaluations, setFilteredEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all evaluations for the user
                const evaluationsData = await fetchEvaluationsByUserId();
                setEvaluations(evaluationsData);
                setFilteredEvaluations(evaluationsData);

                // Fetch all projects
                const projectsData = await fetchAllProjects();
                setProjects(projectsData);
            } catch (error) {
                setError(error.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (event) => {
        const projectId = event.target.value;
        setSelectedProjectId(projectId);

        if (projectId) {
            const filtered = evaluations.filter(evaluation => evaluation.projectId === parseInt(projectId, 10));
            setFilteredEvaluations(filtered);
        } else {
            setFilteredEvaluations(evaluations);
        }
    };
    const handleCardClick = (projectId) => {
        // Navigate to the project's details page
        navigate(`/project/${projectId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>Evaluations</h3>

            {/* Dropdown to filter by project */}
            <div className="mb-3">
                <select
                    className="form-select"
                    value={selectedProjectId}
                    onChange={handleFilterChange}
                >
                    <option value="">All Projects</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>
                            Project ID: {project.id}
                        </option>
                    ))}
                </select>
            </div>

            {/* List of evaluations */}
            <ul className="list-group">
                {filteredEvaluations.length > 0 ? (
                    filteredEvaluations.map(evaluation => (

                        <li key={evaluation.id} className="list-group-item"
                            onClick={() => handleCardClick(evaluation.projectId)}
                        >
                            <div className="evaluation-card">
                            <p><strong>Score:</strong> {evaluation.score}</p>
                            <p><strong>Project ID:</strong> {evaluation.projectId}</p>
                            <p><strong>Created On:</strong> {new Date(evaluation.createdOn).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No evaluations found for the selected project.</p>
                )}
            </ul>
        </div>
    );
};

export default Evaluation;
