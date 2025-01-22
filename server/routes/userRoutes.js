const express = require('express');
const { getAllUsers, getCurrentUser , updateRole , deleteUser} = require('../controllers/userController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const checkRole = require("../middlewares/roleMiddleware");
const ROLES = require("../config/roleConfig");

const router = express.Router();

router.get('/', authMiddleware, checkRole([ROLES.ADMIN]), getAllUsers); // Protected route

// Route to fetch current user (protected)
router.get('/me', authMiddleware, checkRole([ROLES.ADMIN]), getCurrentUser);
router.post('/role', authMiddleware, checkRole([ROLES.ADMIN]), updateRole);
router.delete('/', authMiddleware, checkRole([ROLES.ADMIN]), deleteUser);

module.exports = router;
