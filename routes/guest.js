const express = require('express');
const guestController = require('../controllers/guest');
const isAuth = require('../middleware/auth');
const bidderController = require("../controllers/bidder");
const router = express.Router();

router.get('/', guestController.getHomePage);

router.get('/view-product-list', guestController.getListView);

router.post('/view-product-list', guestController.postListView);

router.get('/view-product-list/view-product/:id', isAuth, guestController.getProductPage);

router.get('/view-product-list/view-product/auction/:price', isAuth, guestController.postAuctionProduct);

// router.post('/view-product-list/view-product/:id', isAuth, guestController.getPostProductPage);

router.get('/view-product-list/view-product/buy-now/:id', isAuth, guestController.getButtonBuy);

module.exports = router;