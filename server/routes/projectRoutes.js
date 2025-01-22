const express = require('express');
const { getProject, createProject, updateProject, getProjectByCollaboratorEmail, deleteProject, getAllProjects} = require('../controllers/projectController');
const uploadFile = require('../controllers/deliverableController');
const {authMiddleware} = require('../middlewares/authMiddleware'); // Adjust the path if needed
const upload = require('../middlewares/multerFile');
const checkRole = require("../middlewares/roleMiddleware");
const ROLES = require("../config/roleConfig");

const router = express.Router();

router.use(authMiddleware);
// Route to create a project
router.get('/',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), getProjectByCollaboratorEmail);
router.post('/create',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), upload.array('files'), createProject);
// Route to create show all projects
router.get('/all',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),getAllProjects);
router.get('/:projectId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), getProject);
router.put('/:projectId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), upload.array('files'), updateProject);
router.delete('/:projectId',authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]), deleteProject); // Add the delete route


module.exports = router;
