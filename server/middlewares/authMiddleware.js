const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ error: 'Unauthorized: Token invalid or expired' });
        }

        req.user = user; // Attach the full user object
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token', message: err.message });
    }
};

module.exports = authMiddleware;



const verifyRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming `req.user` is set after authentication
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authMiddleware, verifyRole };