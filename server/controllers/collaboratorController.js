// controllers/collaboratorController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addCollaborator = async (req, res) => {
    const { projectId, email } = req.body;

    try {
        const collaborator = await prisma.collaborator.create({
            data: {
                email,
                projectId,
            },
        });

        res.status(201).json({ message: 'Collaborator added successfully', collaborator });
    } catch (error) {
        console.error('Error adding collaborator:', error);
        res.status(500).json({ message: 'Failed to add collaborator', error: error.message });
    }
};

module.exports = {
    addCollaborator,
};
