
// controllers/collaboratorController.js
const { PrismaClient } = require('@prisma/client');
const {validationResult} = require("express-validator");
const prisma = new PrismaClient();

// Functia pentru adăugarea unui colaborator
const addCollaborator = async (req, res) => {
    const { projectId, email } = req.body;

    try {
        // Verifică dacă există colaboratori nevalizi
        const unavailableCollaborators = await checkUnavailableCollaborators(req.body.collaborators);

        if (unavailableCollaborators.length > 0) {
            return res.status(400).json({
                message: 'One or more collaborators are already assigned to another project.',
                unavailableCollaborators,  // Trimitem lista colaboratorilor nevalizi
            });
        }

        // Crează colaboratorul doar dacă nu există deja
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

// Funcția care verifică dacă un colaborator există deja pe baza email-ului
const checkUnavailableCollaborators = async (collaborators) => {
    try {
        const existingCollaborators = await prisma.collaborator.findMany({
            where: {
                email: { in: collaborators }, // Căutăm toți colaboratorii pe baza email-urilor
            },
            select: { email: true }, // Doar email-ul colaboratorilor
        });

        return existingCollaborators.map((collaborator) => collaborator.email); // Returnăm lista de email-uri care sunt deja ocupate
    } catch (error) {
        console.error('Error checking collaborators:', error);
        return []; // Dacă apare o eroare, returnăm un array gol
    }
};

const getAllCollaborators = async (req, res) => {
    try {
        const collaborators = await prisma.collaborator.findMany();
        res.status(200).json({ collaborators });
    } catch (error) {
        console.error('Error retrieving collaborators:', error);
        res.status(500).json({ message: 'Failed to retrieve collaborators', error: error.message });
    }
};
const checkCollaboratorExists = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.query;

    try {
        const collaborator = await prisma.user.findUnique({
            where: { email },
        });

        res.json({ exists: !!collaborator });
    } catch (error) {
        console.error('Error checking collaborator existence:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
const checkAvailability = async (req, res) => {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ error: 'Please provide a list of emails.' });
    }

    try {
        const unavailableCollaborators = await checkUnavailableCollaborators(emails);

        const availability = emails.map(email => ({
            email,
            available: !unavailableCollaborators.includes(email),
        }));

        res.status(200).json(availability);
    } catch (error) {
        console.error('Error checking collaborators availability:', error);
        res.status(500).json({ error: 'Failed to check availability' });
    }
};

module.exports = {
    addCollaborator,
    checkUnavailableCollaborators,
    getAllCollaborators,
    checkCollaboratorExists,
    checkAvailability
};
