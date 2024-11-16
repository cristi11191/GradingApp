// controllers/evaluationController.js
// prismaClient.js
const prisma = require('../prismaClient'); // Ensure the correct relative path


module.exports = prisma;


// Add evaluation
const addEvaluation = async (req, res) => {
    const { score, projectId } = req.body;
    const userId = req.user.id; // Assuming `req.user` is set after authentication

    try {
        // Check if user is allowed to evaluate this project
        const existingEvaluation = await prisma.evaluation.findFirst({
            where: { projectId, userID: userId },
        });

        if (existingEvaluation) {
            return res.status(400).json({ message: 'You have already evaluated this project' });
        }

        const evaluation = await prisma.evaluation.create({
            data: {
                score,
                projectId,
                userID: userId,
                createdOn: new Date(),
            },
        });
        res.status(201).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add evaluation', error });
    }
};

const getProjectSummary = async (req, res) => {
    const { projectId } = req.params;

    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { projectId },
            select: { score: true },
        });

        if (evaluations.length < 3) {
            return res.status(400).json({ message: 'Not enough evaluations to calculate grade' });
        }

        // Extract scores
        const scores = evaluations.map((e) => e.score);
        const total = scores.reduce((acc, score) => acc + score, 0);
        const max = Math.max(...scores);
        const min = Math.min(...scores);

        // Calculate average without max and min
        const finalGrade = (total - max - min) / (scores.length - 2);

        res.status(200).json({ finalGrade });
    } catch (error) {
        res.status(500).json({ message: 'Failed to calculate grade', error });
    }
};

const getEvaluations = async (req, res) => {
    const { projectId } = req.params;

    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { projectId },
            select: { score: true, createdOn: true }, // Exclude user information
        });

        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch evaluations', error });
    }
};

module.exports = { addEvaluation, getProjectSummary , getEvaluations };
