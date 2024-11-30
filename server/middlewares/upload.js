const multer = require('multer');
const path = require('path');
const {mkdir} = require("node:fs");
const fs = require("node:fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/projects');
        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name with timestamp
    },
});


// Validate file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',        // JPEG images
        'image/png',         // PNG images
        'application/pdf',   // PDF documents
        'text/plain',        // TXT files
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX files
        'application/vnd.ms-excel',  // XLS files
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // XLSX files
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, TXT, DOCX, and Excel files are allowed.'));
    }
};

// Set up the multer upload middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter,
});

module.exports = upload;
