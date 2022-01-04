const express = require('express');
const bidderController = require('../controllers/bidder');
const isAuth = require('../middleware/auth');
const sellerController = require("../controllers/seller");
const router = express.Router();

router.get('/bidder/profile', bidderController.getPostProfilePage);

router.post('/bidder/profile/:id',  bidderController.editprofile)

router.get('/bidder/profile/changepassword', isAuth,bidderController.getPostchangepass);

router.post('/bidder/profile/changepassword', isAuth, bidderController.editpassword)


module.exports = router;