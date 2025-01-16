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
                const data = await fetchProjectByCollaboratorEmail(); // Fetch evaluările utilizatorului
                console.log(data);
                if(data.length!==0){
                    const projectSummary = await fetchProjectSummary(data.id);
                    const grades = await fetchEvaluationsByProjectId(data.id);
                    if(projectSummary){
                        setFinalScore(projectSummary.finalGrade);
                    }
                    if (grades.length === 0) {
                        setError("Nu există evaluări disponibile.");
                    } else {
                        setEvaluations(grades);
                    }
                }

            } catch (err) {
                setError("A apărut o eroare la preluarea evaluărilor.");
            } finally {
                setLoading(false);
            }
        };

        getEvaluations();
    }, []);

    if (loading) return <p>Se încarcă datele...</p>;

    // Calcularea mediei, maximului și minimului folosind funcția calculateFinalGrade
    const scores = evaluations.map((e) => e.score); // Extrage scorurile din evaluări
    const theFinalGrade = finalScore;
    const max = Math.max(...scores);
    const min = Math.min(...scores);

    return (
        <div className="card my-project-card">
            <h2>Statistics</h2>
            {loading ? (
                <div>Se încarcă datele...</div>
            ) : error ? (
                <div className="no-evaluations">{error}</div>
            ) : finalScore !== null ? (
                <div className="statistics-details">
                    <p>
                        <strong>Final grade average:</strong> {finalScore}
                    </p>
                    <p>
                        <strong>Highest grade:</strong> {Math.max(...evaluations.map((e) => e.score))}
                    </p>
                    <p>
                        <strong>Lowest grade:</strong> {Math.min(...evaluations.map((e) => e.score))}
                    </p>
                </div>
            ) : (
                <div className="no-project">No data available.</div>
            )}
        </div>
    );
};

export default Notifications;
