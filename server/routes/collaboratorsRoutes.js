const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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

module.exports = router;
