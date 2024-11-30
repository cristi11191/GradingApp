// routes/collaboratorRoutes.js
const express = require('express');
const { addCollaborator } = require('../controllers/collaboratorController');
const router = express.Router();

router.post('/',addCollaborator); // Protejat cu autentificare

module.exports = router;
