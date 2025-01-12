const prisma = require('../prismaClient');
const path = require("path");
const fs = require("fs/promises"); // Folosim versiunea promisă a fs

// Upload files
const uploadFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const { title, description, projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        // Example: Save file info to the database (optional)
        // await prisma.file.create({
        //     data: {
        //         title,
        //         description,
        //         projectId,
        //         filename: req.files[0].filename, // Sau alte atribute necesare
        //     }
        // });

        return res.status(201).json({ message: 'Files uploaded successfully', files: req.files });
    } catch (error) {
        console.error('Error uploading files:', error);
        return res.status(500).json({ error: 'Error uploading files', details: error.message });
    }
};

// Delete file
const deleteFile = async (req, res) => {
    try {
        const { fileName } = req.body;
        if (!fileName) {
            return res.status(400).json({ error: 'File name is required' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', 'projects', fileName);
        console.log("Path:", filePath);

        try {
            // Verificăm dacă fișierul există
            await fs.access(filePath);

            // Ștergem fișierul
            await fs.unlink(filePath);

            return res.status(200).json({ message: 'File deleted successfully!' });
        } catch (error) {
            if (error.code === 'ENOENT') {
                return res.status(404).json({ error: 'File not found' });
            }
            console.error('Error deleting file:', error);
            return res.status(500).json({ error: 'Error deleting file' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Download file
const downloadFile = async (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename) {
            return res.status(400).json({ error: 'File name is required' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', 'projects', filename);
        console.log("Path:", filePath);

        // Verificăm dacă fișierul există
        try {
            await fs.access(filePath);

            // Setăm antetele și transmitem fișierul
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).json({ error: 'Error downloading file' });
                }
            });
        } catch (error) {
            if (error.code === 'ENOENT') {
                return res.status(404).json({ error: 'File not found' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Error downloading file', details: error.message });
    }
};

module.exports = { uploadFile, deleteFile, downloadFile };
