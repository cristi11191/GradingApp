// routes/evaluationRoutes.js
const express = require('express');
const { addEvaluation, getEvaluationsByUserId, getEvaluationsByProjectId, getProjectSummary,editEvaluation,
    deleteEvaluation, getUserEvaluationsByProjectId
} = require('../controllers/evaluationController');
const {  authMiddleware} = require('../middlewares/authMiddleware');

const router = express.Router();

// Only "juror" can add evaluations
router.post('/',authMiddleware, addEvaluation);
router.put('/:evaluationId',authMiddleware,editEvaluation);
router.get('/summary/:projectId',authMiddleware,  getProjectSummary);
router.get('/project/:projectId',authMiddleware,  getEvaluationsByProjectId);
router.get('/user/',authMiddleware,  getEvaluationsByUserId);
router.get('/user/:projectId',authMiddleware,  getUserEvaluationsByProjectId);
router.delete('/:evaluationId',authMiddleware,  deleteEvaluation);
module.exports = router;
