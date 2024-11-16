// controllers/userController.js
const prisma = require('../prismaClient');
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

const getCurrentUser = async (req, res) => {
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

        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching current user', message: err.message });
    }
};

module.exports = { getAllUsers, getCurrentUser };
