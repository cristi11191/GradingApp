// router.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { addCollaborator, getAllCollaborators, checkAvailability,checkCollaboratorExists} = require("../controllers/collaboratorController");
const { query, validationResult } = require('express-validator');
const {authMiddleware} = require("../middlewares/authMiddleware");

// Route to check if a collaborator exists
router.get('/exists', authMiddleware, checkCollaboratorExists);

// Route to add a collaborator
router.post('/',authMiddleware, addCollaborator);

// Route to check availability of multiple collaborators
router.post('/checkAvailability',authMiddleware,checkAvailability);

router.get('/all',authMiddleware, getAllCollaborators );

module.exports = router;
