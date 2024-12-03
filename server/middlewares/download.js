const express = require('express');
const path = require('path');
const fs = require('fs'); // Missing in your snippet
const router = express.Router();

// Serve a file for download
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

module.exports = router;