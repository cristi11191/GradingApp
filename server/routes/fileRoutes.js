const express = require('express');
const { deleteFile } = require('../middlewares/delete');

const router = express.Router();
// Delete a file
router.delete('/delete-file', async (req, res) => {
    try {
        const { fileName } = req.body;

        if (!fileName) {
            return res.status(400).json({ error: 'File name is required.' });
        }

        const result = await deleteFile(fileName);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;