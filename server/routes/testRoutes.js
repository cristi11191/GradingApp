// routes/testRoute.js
const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

router.get('/test', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Prisma Client Error', error });
    }
});

module.exports = router;
