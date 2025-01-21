import React, { useEffect, useState } from "react";
import { fetchProjectSummary, fetchEvaluationsByProjectId } from "../../services/apiEvaluations.jsx";
import { fetchProjectByCollaboratorEmail} from "../../services/apiProject.jsx"
import "./Notifications.css";

const Notifications = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [finalScore, setFinalScore] = useState(null);

    useEffect(() => {
        const getEvaluations = async () => {
            try {
                setLoading(true);
                const data = await fetchProjectByCollaboratorEmail();
                //console.log(data);
                if(data.length!==0){
                    const projectSummary = await fetchProjectSummary(data.id);
                    const grades = await fetchEvaluationsByProjectId(data.id);
                    if(projectSummary){
                        setFinalScore(projectSummary.finalGrade);
                    }
                    if (grades.length === 0) {
                        setError("No evaluations found");
                    } else {
                        setEvaluations(grades);
                    }
                }

            } catch (err) {
                setError("Failed to load evaluations.");
            } finally {
                setLoading(false);
            }
        };

        getEvaluations();
    }, []);

    if (loading) return <p>Se încarcă datele...</p>;

    return (
        <div className="my-project-card">
            <h2>Statistics</h2>
            {loading ? (
                <div>Se încarcă datele...</div>
            ) : error ? (
                <div className="no-project">{error}</div>
            ) : finalScore !== null ? (
                <div className="statistics-details">
                    <p>
                        Final grade average: {finalScore}
                    </p>
                    <p>
                        Highest grade:{Math.max(...evaluations.map((e) => e.score))}
                    </p>
                    <p>
                        Lowest grade:{Math.min(...evaluations.map((e) => e.score))}
                    </p>
                </div>
            ) : (
                <div className="no-project">No data available.</div>
            )}
        </div>
    );
};

export default Notifications;
