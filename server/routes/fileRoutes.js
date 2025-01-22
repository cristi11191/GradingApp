const express = require('express');
const {uploadFile, downloadFile,deleteFile} = require("../controllers/deliverableController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const upload = require('../middlewares/multerFile');
const checkRole = require("../middlewares/roleMiddleware");
const ROLES = require("../config/roleConfig");







const router = express.Router();
// Delete a file
router.delete('/delete-file', authMiddleware, checkRole([ROLES.ADMIN,ROLES.USER]),deleteFile  );

router.get('/download/:filename', checkRole([ROLES.ADMIN,ROLES.USER]), downloadFile);

router.post('/upload', upload.array('files') , checkRole([ROLES.ADMIN,ROLES.USER]), uploadFile);

module.exports = router;