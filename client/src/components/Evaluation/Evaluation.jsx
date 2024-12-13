// apiEvaluations.jsx
import React, { useState, useEffect } from 'react';

const Evaluation = ({ projectId }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const response = await fetch(`/api/${projectId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch evaluations');
                }
                const data = await response.json();
                setEvaluations(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluations();
    }, [projectId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>Evaluations for Project {projectId}</h3>
            <ul>
                {evaluations.map((evaluation) => (
                    <li key={evaluation.id}>
                        <p>Score: {evaluation.score}</p>
                        <p>Created On: {new Date(evaluation.createdOn).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Evaluation;
