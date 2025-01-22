const express = require('express');
const { signup, login, validateToken } = require('../controllers/authController');
const {authMiddleware} = require("../middlewares/authMiddleware");
const ROLES = require("../config/roleConfig");
const checkRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/validate', authMiddleware , checkRole([ROLES.ADMIN,ROLES.USER]) ,validateToken);
module.exports = router;
