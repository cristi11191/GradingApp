// controllers/userController.js
const prisma = require('../prismaClient');

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

module.exports = { getAllUsers };
