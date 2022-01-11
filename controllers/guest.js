const dbModel = require('../models/model');
const { Category, Product, User } = require("../models/model");
const { MongoClient: mongoClient } = require("mongodb");
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
                        success: '',
                        message: '',
                        Product: ProductList,
                        Category: CategoryList[0].list
                    });
                }
            })

        }
    }
    )
}

exports.postListView = async (req, res) => {
    console.log(req.body);
    const content = req.body.search;
    const result = await Product.aggregate([
        {
            '$search': {
                'index': 'custom',
                'text': {
                    'query': content,
                    'path': 'name',
                    'fuzzy': {}
                }
            }
        }
    ]);
    console.log(result);
}

exports.getProductPage = async (req, res) => {
    // console.log(req.params.id)
    dbModel.Product.find({ _id: req.params.id }, (err, ProductList) => {
        if (err)
            console.log(err);
        else {
            dbModel.Category.find({}, (err, CategoryList) => {
                if (err)
                    console.log(err);
                else {
                    res.render('view-product', {
                        success: '',
                        topOwner: ProductList[0].topOwner,
                        owner: ProductList[0].owner,
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
    // console.log( req.params.id)
    const categoryList = await Category.find({});

    res.render('view-product', { Category: categoryList[0].list });
}
exports.getButtonBuy = async (req, res) => {
    Product.find({ _id: req.params.id }, async function (err, product, done) {

        let currentProduct = {
            status: 0,
            topPrice: product[0].boughtPrice,
            topOwner: req.user,
        };
        Product.findOneAndUpdate(
            { _id: req.params.id },
            currentProduct,
            { new: true },
            (err, doc) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    })

    res.redirect('/view-product-list');
}
exports.postAuctionProduct = async (req, res) => {

    console.log(req.params);
    var arr = req.params.price.split("+")
    //Lấy dữ liệu sản phẩm
    Product.find({ _id: arr[0] }, async function (err, product, done) {
        // console.log(product)
        // console.log(product[0].originalBidPrice);
        // console.log(product[0].stepPrice);
        if (product[0].timeEnd.getTime() - new Date().getTime() < 0) {
            let currentProduct0 = {
                status: 0
            };
            Product.findOneAndUpdate(
                { _id: arr[0] },
                currentProduct0,
                { new: true },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            dbModel.Category.find({}, (err, CategoryList) => {
                if (err)
                    console.log(err);
                else {

                    res.render('view-product-list', {
                        message: 'Đấu giá sản phẩm không thành công',
                        Category: CategoryList[0].list
                    });
                }
            })
        } else {
            //Trường hợp chưa có ai đấu giá
            if (product[0].bidders.length === 0) {
                let currentProduct = {
                    topPrice: arr[1],
                    currentPrice: parseInt(product[0].originalBidPrice + product[0].stepPrice),
                    topOwner: req.user,
                    $push: {
                        bidders: {
                            bidTime: new Date().toLocaleString(), user: req.user, bidPrice: arr[1]
                        }
                    }
                };
                Product.findOneAndUpdate(
                    { _id: arr[0] },
                    currentProduct,
                    { new: true },
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
            }
            //Trường hợp đã có người đấu giá trước đó
            else {
                //Trường hợp 1: Lớn hơn giá hiện tại nhưng bé hơn topPrice
                if (parseInt(arr[1]) < product[0].topPrice) {
                    let currentProduct1 = {
                        currentPrice: Math.min((parseInt(arr[1]) + parseInt(product[0].stepPrice)), product[0].topPrice),
                        $push: {
                            bidders: {
                                $each: [
                                    { bidTime: new Date().toLocaleString(), user: req.user, bidPrice: arr[1] },
                                    {
                                        bidTime: new Date().toLocaleString(),
                                        user: product[0].topOwner,
                                        bidPrice: Math.min((parseInt(arr[1]) + parseInt(product[0].stepPrice)), product[0].topPrice)
                                    }
                                ]
                            }
                        }
                    };
                    Product.findOneAndUpdate(
                        { _id: arr[0] },
                        currentProduct1,
                        { new: true },
                        (err, doc) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    //Trường hợp 2: Lớn hơn cả giá của top price
                    let currentProduct2 = {
                        topPrice: arr[1],
                        topOwner: req.user,
                        currentPrice: Math.min((product[0].topPrice + product[0].stepPrice), parseInt(arr[1])),
                        $push: {
                            bidders: {
                                $each: [
                                    {
                                        bidTime: new Date().toLocaleString(),
                                        user: product[0].topOwner,
                                        bidPrice: product[0].topPrice
                                    },
                                    {
                                        bidTime: new Date().toLocaleString(),
                                        user: req.user,
                                        bidPrice: Math.min((product[0].topPrice + product[0].stepPrice), arr[1])
                                    }]
                            }
                        }
                    };
                    Product.findOneAndUpdate(
                        { _id: arr[0] },
                        currentProduct2,
                        { new: true },
                        (err, doc) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                }
            }
            // console.log((product[0].timeEnd.getTime() - new Date().getTime()) / 1000);
            if (product[0].timeEnd.getTime() - new Date().getTime() < 5 * 60 * 1000) {
                var time1 = product[0].timeEnd.getTime() + 10 * 60 * 1000;
                time1 = new Date(time1).toLocaleString();
                Product.find({ _id: req.params.id }, async function (err, product, done) {
                    let currentProduct3 = {
                        timeEnd: time1
                    };
                    Product.findOneAndUpdate(
                        { _id: arr[0] },
                        currentProduct3,
                        { new: true },
                        (err, doc) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );

                })
            }
        }
    })
    console.log("áđá");
    dbModel.Product.find({}, (err, ProductList) => {
        if (err)
            console.log(err);
        else {
            dbModel.Category.find({}, (err, CategoryList) => {
                if (err)
                    console.log(err);
                else {
                    res.render('view-product-list', {
                        success: 'Đấu giá thành công',
                        message: '',
                        Product: ProductList,
                        Category: CategoryList[0].list
                    });
                }
            })

        }
    }
    )
}



