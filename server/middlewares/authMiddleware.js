const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach user info to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


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