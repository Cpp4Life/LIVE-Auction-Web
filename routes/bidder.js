const express = require('express');
const bidderController = require('../controllers/bidder');
const isAuth = require('../middleware/auth');
const sellerController = require("../controllers/seller");
const {User} = require("../models/model");
const router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
router.get('/bidder/profile', isAuth, (req, res) => {
    res.render('viewBidder/bidder-profile');
});

router.post('/bidder/profile/:id',bidderController.editprofile);

router.get('/bidder/profile/changepassword', isAuth,bidderController.getPostchangepass);

router.post('/bidder/profile/changepassword/:id', isAuth, bidderController.editpassword)

router.get('/view-product-list/viewproduct', isAuth, bidderController.getProductPage);

router.get('/view-product-list/viewproduct/auction', isAuth, bidderController.getviewauction);

module.exports = router;