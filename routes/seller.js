const express = require('express');
const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/auth');
const bidderController = require("../controllers/bidder");
const {Category} = require("../models/model");
const {Product} = require("../models/model");
const guestController = require("../controllers/guest");
const router = express.Router();

router.get('/seller/post-product', isAuth, sellerController.getPostProductPage);
// router.get('/seller/post-product', sellerController.getPostProductPage);
router.post('/seller/post-product', isAuth, sellerController.postProduct)
// router.post('/seller/post-product', sellerController.postProduct)


router.get('/seller/profile', isAuth, sellerController.getProductselling)

// router.post('/seller/profile/:id',sellerController.editprofile);
router.post('/seller/profile/:id',sellerController.editprofile);

router.get('/seller/profile/changepassword', isAuth,sellerController.getPostchangepass);

router.post('/seller/profile/changepassword/:id', isAuth, sellerController.editpassword)

router.post('/seller/profile/evaluateseller/:id', isAuth, sellerController.postevaluatebidder);
router.post('/seller/profile/evaluateseller/-1/:id', isAuth, sellerController.postedownvotebidder);
router.post('/view-product-list/view-product/editinfo/:id', isAuth, sellerController.posteditinfomation);

router.post('/view-product-list/view-product/kickbidder/:id', isAuth, sellerController.postkickbidder);


module.exports = router;