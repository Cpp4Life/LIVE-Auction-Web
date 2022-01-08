const express = require('express');
const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/auth');
const router = express.Router();

// router.get('/seller/post-product', isAuth, sellerController.getPostProductPage);
router.get('/seller/post-product', sellerController.getPostProductPage);
// router.post('/seller/post-product', isAuth, sellerController.postProduct)
router.post('/seller/post-product', sellerController.postProduct)

module.exports = router;