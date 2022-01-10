const express = require('express');
const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/auth');
const bidderController = require("../controllers/bidder");
const {Category} = require("../models/model");
const {Product} = require("../models/model");
const router = express.Router();

router.get('/seller/post-product', isAuth, sellerController.getPostProductPage);
// router.get('/seller/post-product', sellerController.getPostProductPage);
router.post('/seller/post-product', isAuth, sellerController.postProduct)
// router.post('/seller/post-product', sellerController.postProduct)


router.get('/seller/profile', isAuth, async (req, res) => {
    const ProductList = await Product.find({});

    res.render('viewSeller/seller-profile', { Product: ProductList.list });
});

// router.post('/seller/profile/:id',sellerController.editprofile);
router.post('/seller/profile/:id',sellerController.editprofile);

router.get('/seller/profile/changepassword', isAuth,sellerController.getPostchangepass);

router.post('/seller/profile/changepassword/:id', isAuth, sellerController.editpassword)
module.exports = router;