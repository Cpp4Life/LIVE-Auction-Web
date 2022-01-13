const dbModel = require('../models/model');
const { Category, Product, User } = require("../models/model");
const { MongoClient: mongoClient } = require("mongodb");
const fs = require("fs");
const _ = require('lodash');
const helper = require('../helpers/helper');

exports.getHomePage = (req, res) => {
    dbModel.Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('home', { Category: foundList[0].list });
        }
    })
}
exports.getProfile = (req, res) => {
    dbModel.Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('profile', { Category: foundList[0].list });
        }
    })
}

exports.getListView = async (req, res) => {
    const CategoryList = await Category.find({});
    const productLen = await Product.find({status: 1});

    const numberProduct = 6;
    let total = Object.keys(productLen).length;
    let nPages = Math.floor(total / numberProduct) ;
    if(total % numberProduct > 0) {
        nPages++;
    }
// exports.getListView = (req, res) => {
//     dbModel.Product.find({}, (err, ProductList) => {
//         if (err)
//             console.log(err);
//         else {
//
//             for (let i = 0; i < ProductList.length; i++) {
//                 // console.log(ProductList[i].timeEnd);
//                 // console.log(ProductList[i]);
//
//                 if (ProductList[i].timeEnd.getTime() - new Date().getTime() < 0) {
//                     let currentProduct = {
//                         status: 0,
//                     };
//                     Product.findOneAndUpdate(
//                         { _id: ProductList[i]._id },
//                         currentProduct,
//                         { new: true },
//                         (err, doc) => {
//                             if (err) {
//                                 console.log(err);
//                             }
//                         }
//                     );
//                 }
//             }
//             dbModel.Category.find({}, (err, CategoryList) => {
//                 if (err)
//                     console.log(err);
//                 else {
//
//                     res.render('view-product-list', {
//                         success: '',
//                         message: '',
//                         Product: ProductList,
//                         Category: CategoryList[0].list
//                     });
//                 }
//             })
//
//         }


    var page = parseInt(req.query.page) || 1;

    const pageNumbers = [];
    for(let i = 1; i <= nPages;i++){
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        })
    }
    console.log(page);
    console.log(typeof page)
    var start = (page-1) * numberProduct;
    var end = page * numberProduct;
    // const product = await Product.find({status: 1, productList: {$slice: [start, end]}});
    Product.find({status: 1})
        .skip(start)
        .limit(numberProduct)
        .then(data=>{
            console.log(Object.keys(data).length);
            res.render('view-product-list', {
                success: '',
                message: '',
                Product: data,
                Category: CategoryList[0].list,
                pageNumbers: pageNumbers
            });
        })
        .catch(err=>{
            console.log("Lỗi phân trang");
        })
    // console.log(Object.keys(product).length)
    // console.log(product)
    // console.log(product[1].name)

    // Product.find({}).sort('timeEnd').exec(function (err, docs) {
    //     if (err)
    //         console.log(err);
    //     else {
    //         // console.log('Ascending order');
    //         // for (var i = 0; i < docs.length; i++)
    //         //     console.log(docs[i].timeEnd);
    //     }
    // });
    //
    // Product.find({}).sort([['originalBidPrice', -1]]).exec(function (err, docs) {
    //     if (err)
    //         console.log(err);
    //     else {
    //         // console.log('Descending order');
    //         // for (var i = 0; i < docs.length; i++)
    //         //     console.log(docs[i].originalBidPrice);
    //     }
    // });
    //
    // dbModel.Product.find({}, (err, ProductList) => {
    //     if (err)
    //         console.log(err);
    //     else {
    //
    //         for (let i = 0; i < ProductList.length; i++) {
    //             // console.log(ProductList[i].timeEnd);
    //             // console.log(ProductList[i]);
    //
    //             if (ProductList[i].timeEnd.getTime() - new Date().getTime() < 0) {
    //                 let currentProduct = {
    //                     status: 0,
    //                 };
    //                 Product.findOneAndUpdate(
    //                     { _id: ProductList[i]._id },
    //                     currentProduct,
    //                     { new: true },
    //                     (err, doc) => {
    //                         if (err) {
    //                             console.log(err);
    //                         }
    //                     }
    //                 );
    //             }
    //         }
    //         dbModel.Category.find({}, (err, CategoryList) => {
    //             if (err)
    //                 console.log(err);
    //             else {
    //
    //                 res.render('view-product-list', {
    //                     success: '',
    //                     message: '',
    //                     Product: ProductList,
    //                     Category: CategoryList[0].list
    //                 });
    //             }
    //         })
    //
    //     }
    // }
    // )
}

exports.postListView = async (req, res) => {
    const CategoryList = await Category.find({});
    const content = req.body.search;
    const sortType = req.body.sort;
    var ProductList;

    if (!content) {
        ProductList = await Product.find({});
    } else {
        ProductList = await Product.find({
            $text: {
                $search: content
            }
        }).sort('currentPrice').exec();
    }

    if (sortType) {
        if (sortType === 'ascendingPrice') {
            ProductList = await Product.find({}).sort('currentPrice').exec();
        } else if (sortType === 'descendingPrice') {
            ProductList = await Product.find({}).sort([['currentPrice', -1]]).exec();
        }
    }

    res.render('view-product-list', {
        success: '',
        message: '',
        Product: ProductList,
        Category: CategoryList[0].list
    });
}

exports.getBrandItem = async (req, res) => {
    const CategoryList = await Category.find({});
    const products = await Product.find({});
    const brand = req.params.brand;
    const subBrand = req.params.subBrand;
    const ProductList = [];

    for (var i = 0; i < products.length; i++) {
        const currentBrand = _.kebabCase(helper.normalizeText(products[i].brand));
        const currentSubBrand = _.kebabCase(helper.normalizeText(products[i].subBrand));
        if (currentBrand === brand && currentSubBrand === subBrand) {
            ProductList.push(products[i]);
        }
    }

    res.render('view-product-list', {
        success: '',
        message: '',
        Product: ProductList,
        Category: CategoryList[0].list
    });
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
    );
}

exports.getPostProductPage = async (req, res) => {
    // console.log( req.params.id)
    const categoryList = await Category.find({});

    res.render('view-product', { Category: categoryList[0].list });
}

exports.getButtonBuy = async (req, res) => {
    Product.find({ _id: req.params.id }, async function (err, product, done) {

        if (product[0].timeEnd.getTime() - new Date().getTime() > 0) {
            let currentProduct5 = {
                status: false,
                topPrice: product[0].boughtPrice,
                topOwner: req.user,
            };
            Product.findOneAndUpdate(
                { _id: req.params.id },
                currentProduct5,
                { new: true },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            const categoryList = await Category.find({});
            const productList = await Product.find({});
            res.render('view-product-list', {
                message: "",
                success: "Mua thành công",
                Product: productList,
                Category: categoryList[0].list
            });
        } else {
            let currentProduct6 = {
                status: false,
            };
            Product.findOneAndUpdate(
                { _id: req.params.id },
                currentProduct6,
                { new: true },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            const categoryList = await Category.find({});
            const productList = await Product.find({});
            res.render('view-product-list', {
                message: "Mua không thành công",
                success: "",
                Product: productList,
                Category: categoryList[0].list
            });
        }

    })
}

exports.postAuctionProduct = async (req, res) => {
    console.log(req.params);
    var arr = req.params.price.split("+")
    //Lấy dữ liệu sản phẩm
    // Product.find({_id: arr[0]}, async function(err,product, done) {

    Product.find({ _id: arr[0] }, async function (err, product, done) {
        //Nếu sản phẩm đã hết thời gian đấu giá
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
            const categoryList = await Category.find({});
            const productList = await Product.find({});
            res.render('view-product-list', {
                success: '',
                message: 'Đấu giá sản phẩm không thành công',
                Category: categoryList[0].list,
                Product: productList
            });
        } else {
            //Trường hợp chưa có ai đấu giá
            if (product[0].bidders.length === 0) {
                let currentProduct = {
                    topPrice: arr[1],
                    currentPrice: Math.min(parseInt(product[0].originalBidPrice + product[0].stepPrice), arr[1]),
                    topOwner: req.user,
                    $push: {
                        bidders: {
                            bidTime: new Date().toLocaleString(), user: req.user, bidPrice: Math.min(parseInt(product[0].originalBidPrice + product[0].stepPrice), arr[1])
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
                        currentPrice: Math.min(parseInt(arr[1]) + parseInt(product[0].stepPrice), product[0].topPrice),
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
                    if (product[0].topPrice === product[0].currentPrice) {
                        let currentProduct21 = {
                            topPrice: arr[1],
                            topOwner: req.user,
                            currentPrice: Math.min((product[0].topPrice + product[0].stepPrice), parseInt(arr[1])),
                            $push: {
                                bidders: {
                                    bidTime: new Date().toLocaleString(),
                                    user: req.user,
                                    bidPrice: Math.min((product[0].topPrice + product[0].stepPrice), arr[1])
                                }
                            }

                        }
                        Product.findOneAndUpdate(
                            { _id: arr[0] },
                            currentProduct21,
                            { new: true },
                            (err, doc) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                    } else {
                        let currentProduct22 = {
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
                            currentProduct22,
                            { new: true },
                            (err, doc) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                    }

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
        const categoryList = await Category.find({});
        const productList = await Product.find({});

        res.render('view-product-list', {
            message: "",
            success: "Đấu giá thành công",
            Product: productList,
            Category: categoryList[0].list
        });
    })

}



