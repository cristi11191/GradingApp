const prisma = require('../prismaClient');

const getCounts = async (req, res) => {
    try {
        // Fetch counts for different entities
        const [userCount, projectCount, deliverableCount, evaluationCount] = await Promise.all([
            prisma.user.count(),
            prisma.project.count(),
            prisma.deliverable.count(),
            prisma.evaluation.count()
        ]);

        res.status(200).json({
            users: userCount,
            projects: projectCount,
            deliverables: deliverableCount,
            evaluations: evaluationCount
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching counts', message: error.message });
    }
};

module.exports = { getCounts };
