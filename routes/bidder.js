const express = require('express');
const bidderController = require('../controllers/bidder');
const isAuth = require('../middleware/auth');
const sellerController = require("../controllers/seller");
const {User} = require("../models/model");
const router = express.Router();

const multer  = require('multer')
const guestController = require("../controllers/guest");
const upload = multer({ dest: 'uploads/' })
router.get('/bidder/profile', isAuth, bidderController.getbidderprofile);
//     res.render('viewBidder/bidder-profile');
//
// });

router.post('/bidder/profile/:id',bidderController.editprofile);

router.get('/bidder/profile/changepassword', isAuth,bidderController.getPostchangepass);

router.post('/bidder/profile/changepassword/:id', isAuth, bidderController.editpassword)


//
// router.get('/view-product-list/viewproduct/:id/auction/:id', isAuth, bidderController.getviewauction);
//
// router.post('/view-product-list/viewproduct/:id/auction/:id', isAuth, bidderController.getpostviewauction);

router.get('/view-product-list/viewproduct/favorite/:id', isAuth, bidderController.getfavorites);

router.post('/bidder/profile/evaluateseller/:id', isAuth, bidderController.postevaluateSeller);
router.post('/bidder/profile/evaluateseller/-1/:id', isAuth, bidderController.postedownvoteSeller);


module.exports = router;