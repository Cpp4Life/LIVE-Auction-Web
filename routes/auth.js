const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/user/login', authController.getLoginPage);

router.get('/user/register', authController.getRegisterPage);

router.post('/user/login', authController.postLogin);

router.post('/user/register', authController.postRegister);

router.get('/user/logout', authController.getLogout);

router.post('/user/register/verify-otp', authController.postVerifyOtp);

router.post('/user/register/resend-otp', authController.postResendOtp);

router.get('/auth/google', authController.getGoogleAuth);

router.get('/auth/google/home', authController.getHomeAfterGoogleAuth);

router.get('/auth/facebook', authController.getFacebookAuth);

router.get('/auth/facebook/home', authController.getHomeAfterFacebookAuth);

module.exports = router;