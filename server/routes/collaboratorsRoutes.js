// router.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { addCollaborator, checkUnavailableCollaborators } = require("../controllers/collaboratorController");
const { query, validationResult } = require('express-validator');

// Route to check if a collaborator exists
router.get(
    '/exists',
    [
        query('email').isEmail().withMessage('Invalid email format'),
    ],
    async (req, res) => {
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
    }
);

// Route to add a collaborator
router.post('/', addCollaborator);

// Route to check availability of multiple collaborators
router.post('/checkAvailability', async (req, res) => {
    const { emails } = req.body; // Listele de email-uri primite în corpul cererii

    if (!Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ error: 'Please provide a list of emails.' });
    }

    try {
        // Verifică colaboratorii disponibili
        const unavailableCollaborators = await checkUnavailableCollaborators(emails);

        // Returnăm disponibilitatea colaboratorilor
        const availability = emails.map(email => ({
            email,
            available: !unavailableCollaborators.includes(email), // Dacă email-ul nu este în lista colaboratorilor nevalizi, este disponibil
        }));

        res.status(200).json(availability); // Returnăm disponibilitatea colaboratorilor
    } catch (error) {
        console.error('Error checking collaborators availability:', error);
        res.status(500).json({ error: 'Failed to check availability' });
    }
});

module.exports = router;
