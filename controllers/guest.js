const dbModel = require('../models/model');
const {Category, Product, User} = require("../models/model");
const {MongoClient: mongoClient} = require("mongodb");
const fs = require("fs");

exports.getHomePage = (req, res) => {
    dbModel.Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('home', { Category: foundList[0].list });
        }
    })
}
exports.getListView = (req, res) => {
    dbModel.Product.find({}, (err, ProductList) => {
        if (err)
            console.log(err);
        else {
            dbModel.Category.find({}, (err, CategoryList) => {
                if (err)
                    console.log(err);
                else {

                    res.render('view-product-list', {
                        Product: ProductList,
                        Category: CategoryList[0].list
                    });
                }
            })

            }
        }
    )
}
exports.getProductPage = async (req, res) => {
    // console.log(req.params.id)
    // Product.find({_id: req.params.id}, async function (err, products, done) {
    //     if (err) {
    //         errors.push({msg: ' không tồn tại'});
    //         res.render('viewBidder/change-pass', {
    //             errors,
    //         });
    //     }
    //     if (products) {
    //         console.log(products)
    //         const categoryList = await Category.find({});
    //         res.render('view-product', {Category: categoryList[0].list} , {Product : products});
    //     }
    //
    // })
    dbModel.Product.find({_id: req.params.id}, (err, ProductList) => {
            if (err)
                console.log(err);
            else {
                dbModel.Category.find({}, (err, CategoryList) => {
                    if (err)
                        console.log(err);
                    else {
                        res.render('view-product', {
                            Product: ProductList,
                            Category: CategoryList[0].list
                        });
                    }
                })

            }
        }
    )
}
exports.getpostProductPage = async (req, res) => {
    console.log( req.params.id)
    const categoryList = await Category.find({});

    res.render('view-product', { Category: categoryList[0].list });
}
exports.postAuctionProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.user.id);

    //Lấy dữ liệu sản phẩm
    Product.find({_id: req.params.id}, async function(err,product, done){
        console.log(product);
        //Trường hợp chưa có ai đấu giá
        if(product.bidders.length === 0){
            let currentProduct = {
                topPrice: req.body.price,
                currentPrice: product.originalBidPrice,
                topOwner: req.user,
                $push: {bidders: {
                        bidTime: new Date().toLocaleString(), user: req.user, bidPrice: req.body.price}}
            };
            Product.findOneAndUpdate(
                {_id: req.params.id},
                currentProduct,
                {new: true},
                (err, doc) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        }
        }
    )


    //Trường hợp đã có người đấu giá truóc đó




    dbModel.Product.find( (err, ProductList) => {
            if (err)
                console.log(err);
            else {
                dbModel.Category.find({}, (err, CategoryList) => {
                    if (err)
                        console.log(err);
                    else {
                        res.render('view-product-list', {
                            Product: ProductList,
                            Category: CategoryList[0].list
                        });
                    }
                })

            }
        }
    )
}
