const multer = require('multer');
const path = require('path');

const mimeExtensions = {
    'text/plain': '.txt',
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

// Configure storage
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..','uploads', 'projects')); // Ensure the directory exists
    },
    filename: function (req, file, cb) {
        const datePrefix = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
        const originalName = path.basename(file.originalname, path.extname(file.originalname)); // File name without extension
        const extension = path.extname(file.originalname); // File extension
        const newFilename = `${datePrefix}-${originalName}${extension}`;
        console.log("New File Name" ,newFilename);
        cb(null, newFilename);
    },
});

// Set up Multer
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

module.exports = upload;
