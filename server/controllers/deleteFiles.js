const path = require('path');
const fs = require('node:fs/promises');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to delete a file
const deleteFile = async (fileName) => {
    try {
        const filePath = path.join(__dirname, '../uploads/projects', fileName);

        // Check if file exists
        await fs.access(filePath);

        // Delete the file
        await fs.unlink(filePath);
        return { success: true, message: `File ${fileName} deleted successfully!` };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { success: false, message: `File ${fileName} not found.` };
        }
        throw error;
    }
};

// Function to clean orphaned files
const cleanOrphanedFiles = async () => {
    try {
        const uploadDir = path.join(__dirname, '../uploads/projects');

        // Fetch all files in the uploads directory
        const filesInDirectory = await fs.readdir(uploadDir);

        // Fetch all file paths from the Deliverables table
        const deliverables = await prisma.deliverable.findMany({
            select: {
                attachmentURL: true, // Select only the file paths
            },
        });

        // Extract the file names from the database paths
        const filesInDatabase = deliverables.map((d) => path.basename(d.attachmentURL));

        // Identify orphaned files (present in directory but not in the database)
        const orphanedFiles = filesInDirectory.filter(
            (file) => !filesInDatabase.includes(file)
        );

        // Delete orphaned files
        for (const file of orphanedFiles) {
            const result = await deleteFile(file);
            console.log(result.message);
        }

        console.log('Orphaned file cleanup completed.');
    } catch (error) {
        console.error('Error during orphaned file cleanup:', error.message);
    }
};

// Export functions
module.exports = { deleteFile, cleanOrphanedFiles };
