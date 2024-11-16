const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();


process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex'); // Generate a new random secret

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const testRoute = require('./routes/testRoutes');
const resetTokenVersion = async () => {
  await prisma.user.updateMany({
    data: { tokenVersion: { increment: 1 } }, // Increment tokenVersion for all users
  });
};





app.use('/api', testRoute);
// Use routes
app.use('/api/auth', authRoutes); // Routes for signup and login
app.use('/api/users', userRoutes); // Routes for user data (protected)
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
resetTokenVersion(); // Call this function when the server starts