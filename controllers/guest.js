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
        console.log(product)
        console.log(product[0].originalBidPrice);
        console.log(product[0].stepPrice);
        //Trường hợp chưa có ai đấu giá
        if(product[0].bidders.length === 0){
            let currentProduct = {
                topPrice: req.body.price,
                currentPrice: parseInt(product[0].originalBidPrice + product[0].stepPrice),
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
        //Trường hợp đã có người đấu giá trước đó
        else{
            //Trường hợp 1: Lớn hơn giá hiện tại nhưng bé hơn topPrice
            if(req.body.price < product[0].topPrice){
                let currentProduct1 = {
                    currentPrice: Math.min((parseInt(req.body.price) + parseInt(product[0].stepPrice)),product[0].topPrice),
                    $push: {bidders: { $each:[
                        {bidTime: new Date().toLocaleString(), user: req.user, bidPrice: req.body.price},
                        {bidTime: new Date().toLocaleString(), user: product[0].topOwner, bidPrice: Math.min((parseInt(req.body.price) + parseInt(product[0].stepPrice)),product[0].topPrice)}
                                ]}}
                };
                Product.findOneAndUpdate(
                    {_id: req.params.id},
                    currentProduct1,
                    {new: true},
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
            }else{
                //Trường hợp 2: Lớn hơn cả giá của top price
                let currentProduct2 = {
                    topPrice: req.body.price,
                    topOwner: req.user,
                    currentPrice: Math.min((product[0].topPrice + product[0].stepPrice), req.body.price),
                    $push: {bidders: {$each: [
                {bidTime: new Date().toLocaleString(), user: product[0].topOwner, bidPrice: product[0].topPrice},
                                {bidTime: new Date().toLocaleString(), user: req.user, bidPrice: Math.min((product[0].topPrice + product[0].stepPrice), req.body.price)}]}}
                };
                Product.findOneAndUpdate(
                    {_id: req.params.id},
                    currentProduct2,
                    {new: true},
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
            }
        }
        }
    )




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
