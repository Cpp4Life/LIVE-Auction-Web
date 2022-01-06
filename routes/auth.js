const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/user/login', authController.getLoginPage);

router.get('/user/register', authController.getRegisterPage);

router.get('/user/forgot-password', authController.getForgotPasswordPage);

router.post('/user/login', authController.postLogin);

router.post('/user/register', authController.postRegister);

router.post('/user/forgot-password', authController.postForgotPassword);

router.get('/user/logout', authController.getLogout);

router.post('/user/register/verify-otp', authController.postVerifyOtp);

router.post('/user/register/resend-otp', authController.postResendOtp);

router.post('/user/forgot-password/verify-otp', authController.postForgotPasswordVerifyOtp);

router.post('/user/forgot-password/resend-otp', authController.postForgotPasswordResendOtp);

router.get('/auth/google', authController.getGoogleAuth);

router.get('/auth/google/home', authController.getHomeAfterGoogleAuth);

module.exports = router;