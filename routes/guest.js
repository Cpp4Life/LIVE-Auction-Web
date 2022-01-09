const express = require('express');
const guestController = require('../controllers/guest');
const isAuth = require('../middleware/auth');
const bidderController = require("../controllers/bidder");
const router = express.Router();

router.get('/', guestController.getHomePage);

router.get('/view-product-list', guestController.getListView);

router.get('/view-product-list/viewproduct/:id', isAuth, guestController.getProductPage);

// router.post('/view-product-list/viewproduct/:id', isAuth, guestController.getpostProductPage);

module.exports = router;