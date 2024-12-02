const path = require('path');
const fs = require('node:fs/promises');

// Function to delete a file
const deleteFile = async (fileName) => {
    try {
        const filePath = path.join(__dirname, '../uploads/projects', fileName);

        // Check if file exists
        await fs.access(filePath);

        // Delete the file
        await fs.unlink(filePath);
        return { success: true, message: 'File deleted successfully!' };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { success: false, message: 'File not found.' };
        }
        throw error;
    }
};

module.exports = { deleteFile };
