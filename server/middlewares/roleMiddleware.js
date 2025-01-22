const checkRole = (requiredRoles) => (req, res, next) => {
    try {
        const userRole = req.user.role; // Assume req.user is populated by authMiddleware
        if (!requiredRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Access is denied' });
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkRole;