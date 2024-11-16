// controllers/projectController.js
// prismaClient.js
const prisma = require('../prismaClient'); // Ensure the correct relative path



// Create a new project
const createProject = async (req, res) => {
    const { title, description, attachmentURL, collaborators } = req.body;
    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                attachmentURL,
                collaborators: {
                    create: collaborators.map((email) => ({ email })), // Add collaborators
                },
            },
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create project', error });
    }
};

module.exports = { createProject };
