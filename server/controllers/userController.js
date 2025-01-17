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
const updateRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;

        if (!userId || !newRole) {
            return res.status(400).json({ error: 'User ID and new role are required' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        return res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating user role', message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting user', message: error.message });
    }
};
module.exports = { getAllUsers, getCurrentUser , updateRole , deleteUser };
