const authRoutes = require("./authRoutes");
const testRoute = require("./testRoutes");
const userRoutes = require("./userRoutes");
const express = require("express");
const fileRoutes = require("./fileRoutes");
const projectRoutes = require("./projectRoutes");
const collaboratorRoutes = require("./collaboratorsRoutes");
const evaluationRoutes = require("./evaluationRoutes");
const {getCounts} = require("../utils/dashboardUtils");
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/test', testRoute);
router.use('/user', userRoutes);
router.use('/files', fileRoutes);
router.use('/project', projectRoutes);
router.use('/collaborator', collaboratorRoutes); // Register the collaborator route
router.use('/evaluation',evaluationRoutes);
router.get('/counts', authMiddleware, getCounts);

module.exports = router;
