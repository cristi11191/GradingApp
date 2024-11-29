const express = require('express');
const { getProject, createProject, updateProject } = require('../controllers/projectController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Route to create a project
router.post('/create', upload.array('files'), createProject);
router.get('/:projectId', getProject);
router.put('/:projectId', upload.array('files'), updateProject);

module.exports = router;
