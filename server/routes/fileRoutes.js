const express = require('express');
const {uploadFile, downloadFile,deleteFile} = require("../controllers/deliverableController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const upload = require('../middlewares/multerFile');







const router = express.Router();
// Delete a file
router.delete('/delete-file', authMiddleware,deleteFile  );

router.get('/download/:filename', downloadFile);

router.post('/upload', upload.array('files') , uploadFile);

module.exports = router;