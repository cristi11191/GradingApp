const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const router = express.Router();
const fs = require('fs'); // For checking and creating files
const { execSync } = require('child_process'); // For running Prisma CLI commands
const collaboratorRoutes = require('./routes/collaboratorsRoutes'); // Import the route
const projectRoutes = require('./routes/projectRoutes');
const path = require('path')
const downloadRoutes = require('./middlewares/download');
const fileRoutes = require('./routes/fileRoutes');
const { cleanOrphanedFiles } = require('./controllers/deleteFiles');

const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR);


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();


process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex'); // Generate a new random secret

// Path to the database file
const DB_PATH = './prisma/database.db';

// Check if database.db exists
if (!fs.existsSync(DB_PATH)) {
  console.log('Database file not found. Initializing the database...');
  try {
    // Run Prisma migrations to create the database and schema
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    process.exit(1); // Exit the process if database creation fails
  }
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads/projects directory');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const testRoute = require('./routes/testRoutes');
const validateToken = require("./utils/checkToken");
const resetTokenVersion = async () => {
  await prisma.user.updateMany({
    data: { tokenVersion: { increment: 1 } }, // Increment tokenVersion for all users
  });
};


app.use('/api/validate-token', authRoutes);
app.use('/api', testRoute);
// Use routes
app.use('/api/auth', authRoutes); // Routes for signup and login
// app.use('/api/validate', authRoutes);
app.use('/api/users', userRoutes); // Routes for user data (protected)
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/api', downloadRoutes);
app.use('/files', fileRoutes);
app.use('/api/projects', projectRoutes);
cleanOrphanedFiles().catch((error) => {
  console.error('Error during server start file cleanup:', error.message);
});

app.use('/api/collaborators', collaboratorRoutes); // Register the collaborator route
// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
resetTokenVersion(); // Call this function when the server starts