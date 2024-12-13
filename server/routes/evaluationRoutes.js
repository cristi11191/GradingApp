// routes/evaluationRoutes.js
const express = require('express');
const { addEvaluation, getEvaluationsByUserId, getEvaluationsByProjectId, getProjectSummary,editEvaluation,
    deleteEvaluation
} = require('../controllers/evaluationController');
const { verifyRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only "juror" can add evaluations
router.post('/', addEvaluation);
router.put('/:evaluationId',editEvaluation);
router.get('/summary/:projectId',  getProjectSummary);
router.get('/project/:projectId',  getEvaluationsByProjectId);
router.get('/user/',  getEvaluationsByUserId);
router.delete('/:evaluationId',  deleteEvaluation);
module.exports = router;
