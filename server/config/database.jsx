const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './db.sqlite', // Use an environment variable with a fallback
    logging: process.env.DB_LOGGING === 'true', // Enable/disable logging dynamically
});

// Test the connection and log potential errors
sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
