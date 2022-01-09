const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/login', adminController.getAdminLoginPage);

router.post('/login', adminController.postAdminLogin);

router.get('/settings', adminController.getAdminSettings);

module.exports = router;