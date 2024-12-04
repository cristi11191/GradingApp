const express = require('express');
const { getProject, createProject, updateProject, getProjectByCollaboratorEmail, deleteProject, getAllProjects} = require('../controllers/projectController');
const uploadFile = require('../controllers/deliverableController');
const {authMiddleware} = require('../middlewares/authMiddleware'); // Adjust the path if needed
const multer = require('multer');
const upload = multer({ dest: './uploads/projects' }); // Set the upload destination

const router = express.Router();

router.use(authMiddleware);
// Route to create a project
router.get('/', getProjectByCollaboratorEmail);
router.post('/create', upload.array('files'), createProject);
// Route to create show all projects
router.get('/all',getAllProjects);
router.get('/:projectId', getProject);
router.put('/:projectId', upload.array('files'), updateProject);
router.delete('/:projectId', deleteProject); // Add the delete route


module.exports = router;
