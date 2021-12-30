const express = require('express');
const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/seller/post_product', isAuth, sellerController.getPostProductPage);

router.post('/seller/post_product', isAuth, sellerController.postProduct)

module.exports = router;