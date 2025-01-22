// router.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { addCollaborator, getAllCollaborators, checkAvailability,checkCollaboratorExists} = require("../controllers/collaboratorController");
const { query, validationResult } = require('express-validator');
const {authMiddleware} = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const ROLES = require("../config/roleConfig");

// Route to check if a collaborator exists
router.get('/exists', authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), checkCollaboratorExists);

// Route to add a collaborator
router.post('/',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), addCollaborator);

// Route to check availability of multiple collaborators
router.post('/checkAvailability', checkRole([ROLES.ADMIN,ROLES.USER]),authMiddleware,checkAvailability);

router.get('/all', checkRole([ROLES.ADMIN,ROLES.USER]),authMiddleware, getAllCollaborators );

module.exports = router;
