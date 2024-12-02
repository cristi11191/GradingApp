const express = require('express');
const { getProject, createProject, updateProject, getProjectByCollaboratorEmail, deleteProject} = require('../controllers/projectController');
const upload = require('../middlewares/upload');
const {authMiddleware} = require('../middlewares/authMiddleware'); // Adjust the path if needed


const router = express.Router();

router.use(authMiddleware);
// Route to create a project
router.get('/project', getProjectByCollaboratorEmail);
router.post('/create', upload.array('files'), createProject);
router.get('/:projectId', getProject);
router.put('/:projectId', upload.array('files'), updateProject);
router.delete('/:projectId', deleteProject); // Add the delete route

module.exports = router;
