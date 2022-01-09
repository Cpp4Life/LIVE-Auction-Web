const dbModel = require('../models/model');
const {Category, Product} = require("../models/model");

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
