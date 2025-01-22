// routes/evaluationRoutes.js
const express = require('express');
const { addEvaluation, getEvaluationsByUserId, getEvaluationsByProjectId, getProjectSummary,editEvaluation,
    deleteEvaluation, getUserEvaluationsByProjectId
} = require('../controllers/evaluationController');
const {  authMiddleware} = require('../middlewares/authMiddleware');
const checkRole = require("../middlewares/roleMiddleware");
const ROLES = require("../config/roleConfig");

const router = express.Router();

// Only "juror" can add evaluations
router.post('/',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), addEvaluation);
router.put('/:evaluationId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),editEvaluation);
router.get('/summary/:projectId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),  getProjectSummary);
router.get('/project/:projectId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),  getEvaluationsByProjectId);
router.get('/user/',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),  getEvaluationsByUserId);
router.get('/user/:projectId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),  getUserEvaluationsByProjectId);
router.delete('/:evaluationId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),  deleteEvaluation);
module.exports = router;
