const express = require('express');
const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/seller/post-product', isAuth, sellerController.getPostProduct);

router.post('/seller/post-product', isAuth, sellerController.postProduct)

module.exports = router;