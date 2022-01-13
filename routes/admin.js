const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require("../middleware/auth");
const bidderController = require("../controllers/bidder");
const router = express.Router();

router.get('/login', adminController.getAdminLoginPage);

router.post('/login', adminController.postAdminLogin);

router.get('/settings', adminController.getAdminSettings);

router.post('/settings/category', adminController.postCategory);

router.get('/settings/category/:brand', adminController.getCategoryBrand);

router.post('/settings/category/:brand/delete-item', adminController.postDelBrandItem);

router.post('/settings/category/:brand/add-item', adminController.postAddBrandItem);

router.post('/settings/product/delete/:id', adminController.postDeleteProduct);

router.post('/settings/accounts/', adminController.postAccounts);

router.post('/settings/update-bidder/:id', adminController.updateRequestSeller);

router.post('/settings/cancel-update-bidder/:id', adminController.updateCancelRequestSeller);

module.exports = router;