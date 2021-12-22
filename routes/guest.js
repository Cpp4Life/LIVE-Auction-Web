const express = require('express');
const guestController = require('../controllers/guest');
const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/', guestController.getHomePage);

module.exports = router;