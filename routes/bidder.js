const express = require('express');
const bidderController = require('../controllers/bidder');
const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/bidder/profile', isAuth, (req, res) => {
    res.render('viewBidder/bidder_profile');
});


module.exports = router;