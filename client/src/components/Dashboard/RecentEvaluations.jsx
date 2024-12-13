const RecentEvaluations = ({ evaluations }) => {
    // Ensure evaluations is an array or default to an empty array
    const evaluationsArray = Array.isArray(evaluations) ? evaluations : [];

    return (
        <div className="card recent-evaluations">
            <h2>Recent Evaluations</h2>
            <ul className="evaluation-list">
                {evaluationsArray.length > 0 ? (
                    evaluationsArray.map((evaluation) => {
                        const createdOn = new Date(evaluation.createdOn); // Parse createdOn date

                        return (
                            <li key={evaluation.id} className="evaluation-item">
                                <div className="evaluation-details">
                                    <p><strong>ID:</strong> {evaluation.id}</p>
                                    <p><strong>Score:</strong> {evaluation.score}</p>
                                    <p><strong>Project ID:</strong> {evaluation.projectId}</p>
                                    <p><strong>Created On:</strong> {createdOn.toLocaleDateString()}</p>
                                </div>
                                <button className="btnEdit" onClick={() => handleEdit(evaluation.id)}>
                                    Edit Evaluation
                                </button>
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
        console.log("Edit evaluation with ID:", id);
    }
};

export default RecentEvaluations;
