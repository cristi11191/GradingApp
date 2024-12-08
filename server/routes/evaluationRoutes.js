// routes/evaluationRoutes.js
const express = require('express');
const { addEvaluation } = require('../controllers/evaluationController');
const { verifyRole } = require('../middlewares/authMiddleware');
const { getProjectSummary } = require('../controllers/evaluationController');

const router = express.Router();

// Only "juror" can add evaluations
router.post('/', addEvaluation);
router.get('/summary/:projectId',  getProjectSummary);

module.exports = router;
