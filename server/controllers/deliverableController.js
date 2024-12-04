const prisma = require('../prismaClient'); // Import Prisma client

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

        const filesMetadata = [];

        // Iterate over each uploaded file
        for (const file of req.files) {
            const { filename, mimetype, path } = file;

            // Save metadata to the database
            const deliverable = await prisma.deliverable.create({
                data: {
                    title: title || filename, // Default to filename if title is not provided
                    description: description || '',
                    attachmentURL: path, // Save the file path
                    fileType: mimetype,
                    projectId: parseInt(projectId, 10), // Ensure projectId is an integer
                },
            });

            filesMetadata.push(deliverable);
        }

        return res.status(201).json({ message: 'Files uploaded successfully', files: filesMetadata });
    } catch (error) {
        console.error('Error uploading files:', error);
        return res.status(500).json({ error: 'Error uploading files', details: error.message });
    }
};

module.exports = { uploadFile };
