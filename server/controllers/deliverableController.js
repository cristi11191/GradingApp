const upload = require('../middlewares/upload'); // Import multer configuration
const prisma = require('../prismaClient'); // Import Prisma client

const uploadFile = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get file details
        const { filename, mimetype } = req.file;
        const path = '../uploads/projects';
        // Extract additional data from the request body
        const { title, description, projectId } = req.body;

        // Save metadata to the database
        const deliverable = await prisma.deliverable.create({
            data: {
                title,
                description,
                attachmentURL: path, // Save the file path or URL
                fileType: mimetype,
                projectId: parseInt(projectId, 10), // Ensure projectId is an integer
            },
        });

        return res.status(201).json({ message: 'File uploaded successfully', deliverable });
    } catch (error) {
        return res.status(500).json({ error: 'Error uploading file', details: error.message });
    }
};

module.exports = { uploadFile };
