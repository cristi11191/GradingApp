const express = require('express');
const { uploadFile } = require('../controllers/deliverableController');
const upload = require('../middlewares/upload'); // Multer middleware

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile); // Use multer middleware to handle a single file

module.exports = router;
