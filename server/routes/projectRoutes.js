const express = require('express');
const { getProject, createProject, updateProject, getProjectByCollaboratorEmail, deleteProject, getAllProjects} = require('../controllers/projectController');
const uploadFile = require('../controllers/deliverableController');
const {authMiddleware} = require('../middlewares/authMiddleware'); // Adjust the path if needed
const upload = require('../middlewares/multerFile');

const router = express.Router();

router.use(authMiddleware);
// Route to create a project
router.get('/',authMiddleware, getProjectByCollaboratorEmail);
router.post('/create',authMiddleware, upload.array('files'), createProject);
// Route to create show all projects
router.get('/all',authMiddleware,getAllProjects);
router.get('/:projectId',authMiddleware, getProject);
router.put('/:projectId',authMiddleware, upload.array('files'), updateProject);
router.delete('/:projectId',authMiddleware, deleteProject); // Add the delete route


module.exports = router;
