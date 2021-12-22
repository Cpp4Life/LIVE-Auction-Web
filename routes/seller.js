const express = require('express');
const sellerController = require('../controllers/seller');
<<<<<<< HEAD
const router = express.Router();


router.get('/post-product', sellerController.getPostProductPage);
=======
const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/seller/post-product', isAuth, sellerController.getPostProduct);

>>>>>>> d181341dfd4c6978302d3a690e68f8cb8673ee6b
module.exports = router;