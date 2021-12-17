const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/user/login', authController.getLoginPage);

router.get('/user/register', authController.getRegisterPage);

router.post('/user/login', authController.postLogin);

router.post('/user/register', authController.postRegister);

router.get('/logout', authController.getLogout);

module.exports = router;