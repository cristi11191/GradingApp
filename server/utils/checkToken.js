const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
//
// exports.validateToken = async (req, res) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//         return res.status(400).json({ valid: false, error: 'No token provided' });
//     }
//
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await prisma.user.findUnique({ where: { id: decoded.id } });
//         console.log("User = ", user.tokenVersion);
//         console.log("decoded = " , decoded.tokenVersion);
//         if (!user || user.tokenVersion !== decoded.tokenVersion) {
//             return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
//         }
//
//         return res.json({ valid: true });
//     } catch (err) {
//         return res.status(401).json({ valid: false, error: 'Invalid token', message: err.message });
//     }
// };



const resetAllUserTokens = async () => {
    console.log('Resetting token versions for all users...');
    try {
        await prisma.user.updateMany({
            data: { tokenVersion: { increment: 1 } }, // Increment tokenVersion for all users
        });
        console.log('All user tokens invalidated.');
    } catch (error) {
        console.error('Error resetting token versions:', error);
    }
};
module.exports = resetAllUserTokens;