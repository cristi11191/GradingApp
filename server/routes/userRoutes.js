const express = require('express');
const { getAllUsers, getCurrentUser} = require('../controllers/userController');
const {authMiddleware} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllUsers); // Protected route

// Route to fetch current user (protected)
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
