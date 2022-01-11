const express = require('express');
const guestController = require('../controllers/guest');
const isAuth = require('../middleware/auth');
const bidderController = require("../controllers/bidder");
const router = express.Router();

router.get('/', guestController.getHomePage);

router.get('/view-product-list', guestController.getListView);

router.get('/view-product-list/viewproduct/:id', isAuth, guestController.getProductPage);
router.get('/view-product-list/viewproduct/auction/:price', isAuth, guestController.postAuctionProduct);
// router.post('/view-product-list/viewproduct/:id', isAuth, guestController.getpostProductPage);
router.get('/view-product-list/viewproduct/buynow/:id', isAuth, guestController.getButtonBuy);
module.exports = router;