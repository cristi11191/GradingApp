import React from "react";

const EvaluationsList = ({ evaluations = [] }) => {
  if (evaluations.length === 0) {
    return <p>No evaluations found.</p>;
  }

  return (
    <ul>
      {evaluations.map((evaluation) => (
        <li key={evaluation.id}>
          <strong>Evaluator:</strong> {evaluation.evaluator} - <strong>Score:</strong> {evaluation.score}
        </li>
      ))}
    </ul>
  );
};

export default EvaluationsList;
