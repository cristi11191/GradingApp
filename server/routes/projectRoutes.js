// routes/projectRoutes.js
const express = require('express');
const { createProject } = require('../controllers/projectController');
const { verifyRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only "user" can create a project
router.post('/', verifyRole(['user']), createProject);

module.exports = router;
