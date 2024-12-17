// routes/testRoute.js
const express = require('express');
const prisma = require('../prismaClient');
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/',authMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Prisma Client Error', error });
    }
});

module.exports = router;
