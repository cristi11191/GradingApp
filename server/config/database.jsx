const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite', // Fișierul în care se vor stoca datele
});

module.exports = sequelize;
