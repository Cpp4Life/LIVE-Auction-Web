const express = require('express');
const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/auth');
const bidderController = require("../controllers/bidder");
const router = express.Router();

// router.get('/seller/post-product', isAuth, sellerController.getPostProductPage);
router.get('/seller/post-product', sellerController.getPostProductPage);
// router.post('/seller/post-product', isAuth, sellerController.postProduct)
router.post('/seller/post-product', sellerController.postProduct)


router.get('/seller/profile', isAuth, (req, res) => {
    res.render('viewSeller/seller-profile');
});

// router.post('/seller/profile/:id',sellerController.editprofile);
router.post('/seller/profile/:id',sellerController.editprofile);

router.get('/seller/profile/changepassword', isAuth,sellerController.getPostchangepass);

router.post('/seller/profile/changepassword/:id', isAuth, sellerController.editpassword)

module.exports = router;