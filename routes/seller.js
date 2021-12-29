const express = require('express');
const sellerController = require('../controllers/seller');
<<<<<<< HEAD

//const router = express.Router();


=======
>>>>>>> b2d7bec151cb3e871648cad6dc8090fe8ecdf2ca
const isAuth = require('../middleware/auth');
const router = express.Router();

router.get('/post-product', sellerController.getPostProductPage);
//router.get('/seller/post-product', isAuth, sellerController.getPostProduct);
router.post('/post-product', sellerController.postProduct)



module.exports = router;