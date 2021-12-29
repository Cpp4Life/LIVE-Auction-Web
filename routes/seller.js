const express = require('express');
const sellerController = require('../controllers/seller');

//const router = express.Router();


const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/post-product', sellerController.getPostProductPage);
//router.get('/seller/post-product', isAuth, sellerController.getPostProduct);
router.post('/post-product', sellerController.postProduct)



module.exports = router;