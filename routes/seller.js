const express = require('express');
const sellerController = require('../controllers/seller');
const router = express.Router();


router.get('/post-product', sellerController.getPostProductPage);
module.exports = router;