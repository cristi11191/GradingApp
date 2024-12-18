import { useEffect, useState } from "react";
import { fetchEvaluationsByUserId } from "../../services/apiEvaluations.jsx";

const RecentEvaluations = () => {
    const [evaluation, setEvaluation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEvaluations = async () => {
            const data = await fetchEvaluationsByUserId();
            if (data.length === 0) {
                setError("No evaluations found for this user.");
            } else {
                setEvaluation(data[0]); // Set the first evaluation
            }
        };

        getEvaluations().catch(() => {
            setError("Failed to load evaluations."); // Fallback error
        });
    }, []);

    return (
        <div className="card recent-evaluations">
            <h2>Recent Evaluations</h2>
            {error ? (
                <div className="no-evaluations">{error}</div>
            ) : evaluation ? ( // Only render if evaluation is not null
                <div className="evaluation-details">
                    <p>
                        <strong>ID:</strong> {evaluation.id}
                    </p>
                    <p>
                        <strong>Score:</strong> {evaluation.score}
                    </p>
                    <p>
                        <strong>Project ID:</strong> {evaluation.projectId}
                    </p>
                    <p>
                        <strong>Created On:</strong> {evaluation.createdOn}
                    </p>
                </div>
            ) : (
                <div>Loading evaluations...</div> // Show loading state while fetching data
            )}
        </div>
    );
};

export default RecentEvaluations;
