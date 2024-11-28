const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();



exports.validateToken = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(400).json({ valid: false, error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
        }

        return res.json({ valid: true , tokenVersion:user.tokenVersion });
    } catch (err) {
        return res.status(401).json({ valid: false, error: 'Invalid token', message: err.message });
    }
};



// User signup
exports.signup = async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;
    try {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }
        if( password !== confirmPassword){
            return res.status(400).json({error: 'Password and ConfirmPassword are different! '});
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: role || 'user' },
        });

        // Generate token for the new user
        const token = generateToken(newUser.id);
        res.json({ user: newUser, token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: 'Signup failed' });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user);
            res.json({ user, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'Login failed' });
    }
};
