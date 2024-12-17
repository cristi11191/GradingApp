// controllers/evaluationController.js
// prismaClient.js
const prisma = require('../prismaClient');
const jwt = require("jsonwebtoken");
const {calculateFinalGrade} = require("../utils/gradeUtils"); // Ensure the correct relative path
module.exports = prisma;


// Add evaluation
// Add evaluation
const addEvaluation = async (req, res) => {
    const { score, projectId } = req.body;

    try {
        // Extract token from headers
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Token absent' });
        }

        // Decode the token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate score
        if (typeof score !== 'number' || score < 1 || score > 10 || !/^\d+(\.\d{1,2})?$/.test(score.toString())) {
            return res.status(400).json({ error: 'Score must be a number between 1 and 10, with up to 2 decimal places.' });
        }

        // Check if user is a collaborator on the project
        const isCollaborator = await prisma.collaborator.findFirst({
            where: { projectId: parseInt(projectId, 10), email: user.email },
        });

        if (isCollaborator) {
            return res.status(403).json({ message: 'Collaborators cannot evaluate their own projects' });
        }
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) },
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if user has already evaluated the project
        const existingEvaluation = await prisma.evaluation.findFirst({
            where: { projectId: parseInt(projectId, 10), userID: user.id },
        });

        if (existingEvaluation) {
            return res.status(400).json({ message: 'You have already evaluated this project' });
        }

        // Create evaluation
        const evaluationData = {
            score: parseFloat(score), // Ensure score is a float
            projectId: parseInt(projectId, 10), // Ensure projectId is an integer
            userID: user.id, // Comes from token
            createdOn: new Date(),
        };

        const evaluation = await prisma.evaluation.create({ data: evaluationData });
        res.status(201).json(evaluation);
    } catch (error) {
        console.error('Error adding evaluation:', error);
        res.status(500).json({ message: 'Failed to add evaluation', error });
    }
};


const getProjectSummary = async (req, res) => {
    const { projectId } = req.params;

    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { projectId: parseInt(projectId, 10) },
            select: { score: true },
        });
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) },
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const scores = evaluations.map((e) => e.score);

        if (scores.length === 0) {
            return res.status(400).json({ message: 'No evaluations found for this project' });
        }

        // Use the utility function to calculate the final grade
        const finalGrade = calculateFinalGrade(scores);

        res.status(200).json({ finalGrade });
    } catch (error) {
        console.error('Error calculating grade:', error);
        res.status(500).json({ message: 'Failed to calculate grade', error });
    }
};


const getEvaluationsByProjectId = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) },
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const evaluations = await prisma.evaluation.findMany({
            where: {projectId: parseInt(projectId, 10)},
            select: { id:true ,score: true, createdOn: true }, // Exclude user information
        });

        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch evaluations', error });
    }
};

const getEvaluationsByUserId = async (req, res) => {

    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Token absent' });
        }

        // Decode the token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Găsește toate evaluarile realizate de utilizatorul specificat
        const evaluations = await prisma.evaluation.findMany({
            where: { userID: parseInt(decoded.id, 10) },
            select: {
                id:true,
                score: true,
                projectId: true,
                createdOn: true, // Opțional, dacă dorești să vezi data evaluării
            },
        });

        // Verifică dacă utilizatorul are evaluări
        if (evaluations.length === 0) {
            return res.status(404).json({ message: 'No evaluations found for this user' });
        }

        // Returnează lista evaluărilor
        res.status(200).json({ evaluations });
    } catch (error) {
        console.error('Error fetching evaluations by user ID:', error);
        res.status(500).json({ message: 'Failed to fetch evaluations', error });
    }
};
// Delete evaluation
const deleteEvaluation = async (req, res) => {
    const {evaluationId} = req.params;

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({error: 'Token absent'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({where: {id: decoded.id}});

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const evaluation = await prisma.evaluation.findUnique({where: {id: parseInt(evaluationId, 10)}});

        if (!evaluation) {
            return res.status(404).json({error: 'Evaluation not found'});
        }

        if (evaluation.userID !== user.id) {
            return res.status(403).json({error: 'You are not authorized to delete this evaluation'});
        }

        await prisma.evaluation.delete({where: {id: parseInt(evaluationId, 10)}});

        res.status(200).json({message: 'Evaluation deleted successfully'});
    } catch (error) {
        console.error('Error deleting evaluation:', error);
        res.status(500).json({message: 'Failed to delete evaluation', error});
    }
};

const editEvaluation = async (req, res) => {
    const { evaluationId } = req.params;
    const { score } = req.body;

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Token absent' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate score
        if (typeof score !== 'number' || score < 1 || score > 10 || !/^\d+(\.\d{1,2})?$/.test(score.toString())) {
            return res.status(400).json({ error: 'Score must be a number between 1 and 10, with up to 2 decimal places.' });
        }
        const evaluation = await prisma.evaluation.findUnique({ where: { id: parseInt(evaluationId, 10) } });

        if (!evaluation) {
            return res.status(404).json({ error: 'Evaluation not found' });
        }

        if (evaluation.userID !== user.id) {
            return res.status(403).json({ error: 'You are not authorized to edit this evaluation' });
        }

        const updatedEvaluation = await prisma.evaluation.update({
            where: { id: parseInt(evaluationId, 10) },
            data: { score: parseFloat(score) },
        });

        res.status(200).json(updatedEvaluation);
    } catch (error) {
        console.error('Error editing evaluation:', error);
        res.status(500).json({ message: 'Failed to edit evaluation', error });
    }
};


module.exports = { addEvaluation, getProjectSummary , getEvaluationsByProjectId,getEvaluationsByUserId,editEvaluation,deleteEvaluation };
