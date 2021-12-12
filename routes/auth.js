const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/user/login', authController.getLoginPage);

router.get('/user/register', authController.getRegisterPage);

module.exports = router;