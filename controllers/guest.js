const dbModel = require('../models/model');
const {Category} = require("../models/model");

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

                    res.render('viewListProduct', {
                        Product: ProductList,
                        Category: CategoryList[0].list
                    });
                }
            })

            }
        }
    )
}
