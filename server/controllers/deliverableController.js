const prisma = require('../prismaClient');
const path = require("path");
const fs = require("fs"); // Import Prisma client

const uploadFile = async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const { title, description, projectId } = req.body;
        // Validate required fields
        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        return res.status(201).json({ message: 'Files uploaded successfully', files: req.files });
    } catch (error) {
        console.error('Error uploading files:', error);
        return res.status(500).json({ error: 'Error uploading files', details: error.message });
    }
};


const deleteFile = async (req, res) => {
    try {
        const { fileName } = req.body;

        try {
            const filePath = path.join(__dirname, '..','uploads','projects', fileName);
            console.log("path",filePath);

            // Check if file exists
            await fs.access(filePath);

            // Delete the file
            await fs.unlink(filePath);
            return { success: true, message: 'File deleted successfully!' };
        } catch (error) {
            if (error.code === 'ENOENT') {
                return { success: false, message: 'File not found.' };
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const downloadFile = async (req,res)=>{
    const filePath = path.join(__dirname, '..', 'uploads', 'projects', req.params.filename);
    console.log(filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }

    // Set headers to force download
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.originalname}"`);
    res.setHeader('Content-Type', 'application/octet-stream'); // Force the file to be treated as a binary

    // Stream the file to the client
    res.download(filePath, req.params.filename, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
}

module.exports = { uploadFile,deleteFile,downloadFile };
