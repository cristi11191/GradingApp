import React from "react";
import "./QuickStats.css";

const QuickStats = ({ stats }) => {
    return (
        <div className="card">
            <h2>Quick Stats</h2>
            <div className="contents">
                <p>Number of Projects: {stats.numProjects}</p>
                <p>Pending Evaluations: {stats.pendingEvaluations}</p>
                <p>Completed Evaluations: {stats.completedEvaluations}</p>
            </div>

        </div>
    );
};

export default QuickStats;
