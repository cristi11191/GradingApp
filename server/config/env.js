// /config/env.js
require('dotenv').config();

module.exports = {
    DB_DIALECT: process.env.DB_DIALECT || 'sqlite',
    DB_STORAGE: process.env.DB_STORAGE || './db.sqlite',
    DB_LOGGING: process.env.DB_LOGGING === 'true',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'database',
};
