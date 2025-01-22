// /config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Set database configuration dynamically
const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './db.sqlite', // SQLite default
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || null,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || null,
    logging: process.env.DB_LOGGING === 'true', // Conditional logging
    pool: {
        max: 10, // Maximum number of connections
        min: 0,  // Minimum number of connections
        acquire: 30000, // Maximum time (ms) to acquire a connection
        idle: 10000, // Time (ms) after which idle connections are released
    },
});

// Exporting the database connection as a function to handle environments better
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
