const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/user/login', authController.getLoginPage);

router.get('/user/register', authController.getRegisterPage);

router.post('/user/login', authController.postLogin);

router.post('/user/register', authController.postRegister);

router.get('/user/logout', authController.getLogout);

router.post('/user/verify-otp', authController.postVerifyOtp);

router.post('/user/resend-otp', authController.postResendOtp);

module.exports = router;