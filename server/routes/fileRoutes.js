const express = require('express');
const {uploadFile, downloadFile,deleteFile} = require("../controllers/deliverableController");
const {authMiddleware} = require("../middlewares/authMiddleware");






const router = express.Router();
// Delete a file
router.delete('/delete-file', authMiddleware,deleteFile  );

router.get('/download/:filename', authMiddleware, downloadFile);

router.post('/upload',authMiddleware, uploadFile); // Use multer middleware to handle a single file

module.exports = router;