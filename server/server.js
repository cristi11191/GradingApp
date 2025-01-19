const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const fs = require('fs'); // For checking and creating files
const { execSync } = require('child_process'); // For running Prisma CLI commands
const { cleanOrphanedFiles } = require('./controllers/deleteFiles');
const router = require('./routes/indexRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();
const uploadDir = './uploads';
const DB_PATH = './prisma/database.db';
process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex'); // Generate a new random secret
const allowedOrigins = ['https://grading-app-six.vercel.app' , 'https://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// Set API routes
app.use('/api', router);

const resetTokenVersion = async () => {
  await prisma.user.updateMany({
    data: { tokenVersion: { increment: 1 } }, // Increment tokenVersion for all users
  });
};

// Initialize database and uploads directory if they don't exist
if (!fs.existsSync(DB_PATH)) {
  console.log('Database file not found. Initializing the database...');
  try {
    // Run Prisma migrations to create the database and schema
    execSync('npx prisma migrate dev --name init --schema=./prisma/schema.prisma', { stdio: 'inherit' });
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

// Clean up orphaned files on startup
cleanOrphanedFiles().catch((error) => {
  console.error('Error during server start file cleanup:', error.message);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Backend server shutting down...');
  process.exit(0); // Exit gracefully
});

process.on('SIGTERM', () => {
  console.log('Backend server received termination signal.');
  process.exit(0); // Exit gracefully
});


// Reset token version for users
resetTokenVersion();
