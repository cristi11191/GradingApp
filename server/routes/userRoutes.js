const express = require('express');
const { getAllUsers, getCurrentUser , updateRole , deleteUser} = require('../controllers/userController');
const {authMiddleware} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllUsers); // Protected route

// Route to fetch current user (protected)
router.get('/me', authMiddleware, getCurrentUser);
router.post('/role', authMiddleware, updateRole);
router.delete('/', authMiddleware, deleteUser);

module.exports = router;
