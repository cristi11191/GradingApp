import React from "react";
import "./RecentEvaluations.css"; // Adăugăm fișierul de stiluri pentru RecentEvaluations

const RecentEvaluations = ({ evaluations }) => {
    const currentDate = new Date(); // Data curentă pentru a compara cu deadline-ul

    return (
        <div className="card recent-evaluations">
            <h2>Recent Evaluations</h2>
            <ul className="evaluation-list">
                {evaluations.length > 0 ? (
                    evaluations.map((evaluation) => {
                        const deadline = new Date(evaluation.deadline);
                        const isPastDeadline = deadline < currentDate;

                        return (
                            <li key={evaluation.id} className="evaluation-item">
                                <div className="evaluation-details">
                                    <p><strong>Title:</strong> {evaluation.title}</p>
                                    <p><strong>Description:</strong> {evaluation.description}</p>
                                    <p><strong>Deadline:</strong> {deadline.toLocaleDateString()}</p>
                                </div>
                                {!isPastDeadline && (
                                    <button className="btnEdit" onClick={() => handleEdit(evaluation.id)}>
                                        Edit Evaluation
                                    </button>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <div className="no-evaluations">No evaluations available.</div>
                )}
            </ul>
        </div>
    );

    function handleEdit(id) {
        // Logica pentru editarea evaluării (poate fi un link sau modal de editare)
        console.log("Edit evaluation with ID:", id);
    }
};

export default RecentEvaluations;
