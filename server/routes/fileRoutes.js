const express = require('express');
const { deleteFile } = require('../controllers/deleteFiles');
const path = require("path");
const fs = require("fs");
const upload = require("../controllers/deliverableController");
const {uploadFile} = require("../controllers/deliverableController");






const router = express.Router();
// Delete a file
router.delete('/delete-file', async (req, res) => {
    try {
        const { fileName } = req.body;

        if (!fileName) {
            return res.status(400).json({ error: 'File name is required.' });
        }

        const result = await deleteFile(fileName);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, '..', 'uploads/projects', req.params.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }

    // Set headers to force download
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream'); // Force the file to be treated as a binary

    // Stream the file to the client
    res.download(filePath, req.params.filename, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
});

router.post('/upload', uploadFile); // Use multer middleware to handle a single file

module.exports = router;