const express = require('express');
const guestController = require('../controllers/guest');
const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/', guestController.getHomePage);

router.get('/post-product', isAuth, (req, res) => { res.send('Success') });

module.exports = router;