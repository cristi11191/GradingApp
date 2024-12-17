import React from "react";
import "./EvaluationList.css";

const EvaluationsList = ({ evaluations = [] }) => {
  if (evaluations.length === 0) {
    return <p>No evaluations found.</p>;
  }

  return (
    <ul>
      {evaluations.map((evaluation, index) => (
          <li key={evaluation.id} className="textcolor">
            Evaluator: <strong >{index + 1}</strong> Score: <strong>{evaluation.score}</strong>
          </li>
      ))}

    </ul>
  );
};

export default EvaluationsList;
