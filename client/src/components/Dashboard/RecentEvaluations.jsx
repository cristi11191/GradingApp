import React, { useEffect, useState } from "react";
import { fetchEvaluationsByUserId } from "../../services/apiEvaluations.jsx";
import "./RecentEvaluations.css";

const RecentEvaluations = ({ projects }) => {
    const [evaluation, setEvaluation] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEvaluations = async () => {
            try {
                const data = await fetchEvaluationsByUserId();
                if (!data || data.length === 0) {
                    setError("No evaluations found for this user.");
                } else {
                    const firstEvaluation = data[0];
                    setEvaluation(firstEvaluation);

                    // Găsește detaliile proiectului asociat evaluării
                    const project = projects.find(
                        (project) => project.id === firstEvaluation.projectId
                    );
                    setProjectDetails(project || null);
                }
            } catch (err) {
                setError("Failed to load evaluations.");
            } finally {
                setLoading(false); // Dezactivează starea de încărcare
            }
        };

        getEvaluations();
    }, [projects]);

    // Afișare mesaj de eroare
    if (error) {
        return (
            <div className="recent-evaluations">
                <h2>Evaluated Project Details</h2>
                <div className="no-evaluations">{error}</div>
            </div>
        );
    }

    // Afișare mesaj de încărcare
    if (loading) {
        return (
            <div className="recent-evaluations">
                <h2>Evaluated Project Details</h2>
                <div>Loading evaluation...</div>
            </div>
        );
    }

    if (error || !evaluation || !projectDetails) {
        return (
            <div className="recent-evaluations">
                <h2>Evaluated Project Details</h2>
                <div className="no-project">No data available.</div>
            </div>
        );
    }


    // Afișare evaluare și detalii proiect
    return (
        <div className="recent-evaluations">
            <h2>Recently Evaluation Details</h2>
            <ul className="evaluation-list">
                <li className="evaluation-item">
                    <p className="project-title">{projectDetails.title}</p>
                    <p className="evaluation-score">
                        <strong>Score:</strong> {evaluation.score}
                    </p>
                    <p className="evaluation-date">
                        <strong>Created On:</strong>{" "}
                        {new Intl.DateTimeFormat("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        }).format(new Date(evaluation.createdOn))}
                    </p>
                </li>
            </ul>
        </div>
    );
};

export default RecentEvaluations;
