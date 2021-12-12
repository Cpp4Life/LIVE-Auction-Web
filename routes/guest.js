const express = require('express');
const guestController = require('../controllers/guest');
const router = express.Router();

router.get('/', guestController.getHomePage);

module.exports = router;