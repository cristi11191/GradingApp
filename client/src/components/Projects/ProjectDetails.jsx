import React, { useEffect, useState } from 'react';
import {fetchProjectById} from '../../services/apiProject';
import {
    createEvaluation,
    fetchEvaluationsByProjectId,
    fetchUserEvaluationsByProjectId,
    updateEvaluation, fetchProjectSummary
} from '../../services/apiEvaluations'; // Add API import
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(''); // State for score input
    const [evaluations, setEvaluations] = useState([]); // Local state for evaluations
    const [userEvaluation, setUserEvaluation] = useState(null);
    const [userRole, setRole] = useState(null);
    const [finalScore, setFinalScore] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectData = await fetchProjectById(projectId);
                setProject(projectData.project);
                setEvaluations(projectData.project.evaluations || []);
                const role = localStorage.getItem("role");
                setRole(role);

                const userEval = await fetchUserEvaluationsByProjectId(projectId) || [];

                if (userEval.evaluations[0]) {
                    setUserEvaluation(userEval.evaluations[0]);
                    setScore(userEval.evaluations[0].score); // Set user's score in the input
                }

                const evaluationsProject = await fetchEvaluationsByProjectId(projectId);
                if(evaluationsProject) {
                    setEvaluations(evaluationsProject);
                }

                const projectSummary = await fetchProjectSummary(projectId);
                if(projectSummary){
                setFinalScore(projectSummary.finalGrade);
                }
            } catch (err) {
                setError('Failed to load project details.');
            }
        };

        if (projectId) {
            fetchProjectDetails();
        }
    }, [projectId]);
    const isEvaluationOlderThan12Hours = () => {
        if (!userEvaluation || !userEvaluation.createdOn) return false;
        const createdOnTime = new Date(userEvaluation.createdOn).getTime();
        const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;
        return createdOnTime < twelveHoursAgo;
    };
    const handleUpdateEvaluation = async (evaluationId, updatedScore) => {
        try {
            const updatedEvaluation = await updateEvaluation(evaluationId, { score: updatedScore });

            // Update evaluations state
            setEvaluations((prevEvaluations) =>
                prevEvaluations.map((ev) =>
                    ev.id === evaluationId ? updatedEvaluation : ev
                )
            );

            // Update user's evaluation state
            setUserEvaluation(updatedEvaluation);

            // Recalculate final score
            const projectSummary = await fetchProjectSummary(projectId);
            if (projectSummary) {
                setFinalScore(projectSummary.finalGrade);
            }
            alert("Your Evaluation has been updated! New : "+updatedScore);
        } catch (error) {
            console.error('Failed to update evaluation:', error);
            setError('Failed to update evaluation.');
        }
    };


    // Function to handle evaluation submission
    const handleSubmitEvaluation = async (e) => {
        e.preventDefault();

        const parsedScore = parseFloat(score);
        if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
            alert("Please enter a valid score between 0 and 10 (decimals allowed).");
            return;
        }
        try {
            e.preventDefault();
            const parsedScore = parseFloat(score);
            if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) return;
            if(userEvaluation){
                await handleUpdateEvaluation(userEvaluation.id, parsedScore);
            } else {
                const newEvaluation = await createEvaluation(project.id, {score: parsedScore});
                setEvaluations([...evaluations, newEvaluation]);
                setUserEvaluation(newEvaluation);
                setScore('');
            }

            const projectSummary = await fetchProjectSummary(projectId);
            if(projectSummary){
                setFinalScore(projectSummary.finalGrade);
            }
        } catch (err) {
            console.error('Failed to submit evaluation:', err);
            setError('Failed to submit evaluation.');
        }
    };
    if (error) return <p>{error}</p>;
    if (!project) return <p>Loading project details...</p>;

    return (
        <div className="my-project-container">
            <button className="close-button" onClick={() => navigate(-1)}>
                ✖
            </button>
            <div className="my-project">
                <h1 className="my-project-text">Project</h1>
                <h2>Title: {project.title}</h2>
                <p>Description: {project.description}</p>
                <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>

                <h3>Collaborators</h3>
                {/*<CollaboratorsList collaborators={project.collaborators} projectId={project.id}/>*/}
                {project.collaborators.length === 0 ? (<p>No Collaborators found. </p>) :
                    (<ul>
                        {project.collaborators.map((collaborator) => (
                            <li className="collab-color" key={collaborator.id}>
                                <strong>{collaborator.name}</strong> {collaborator.email}
                            </li>
                        ))}
                    </ul>)}


                <h3>Evaluations</h3>
                <div className="evaluations-container">
                    {evaluations.length === 0 ? (
                        <p>No evaluations found.</p>
                    ) : (
                        <ul className="evaluations-list">
                            {evaluations.map((evaluation, index) => (
                                <li key={evaluation.id} className="textcolor">
                                    Evaluator: <strong>{index + 1}</strong> Score: <strong>{evaluation.score}</strong>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <p className="overall-score">Overall: <strong>{finalScore}</strong></p>
                <h3>My Evaluation:</h3>
                {userRole === 'user' && (
                    isEvaluationOlderThan12Hours() ? (
                        <p>Your Score: <strong>{userEvaluation?.score}</strong></p>
                    ) : (
                        <form className="my-evaluation-form" onSubmit={handleSubmitEvaluation}>
                            <input
                                type="number"
                                step="0.01"
                                min="1"
                                max="10"
                                placeholder="Score"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            />
                            <button type="submit">{userEvaluation ? 'Update' : 'Submit'}</button>
                        </form>
                    )
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
