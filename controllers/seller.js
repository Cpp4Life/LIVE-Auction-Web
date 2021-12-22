<<<<<<< HEAD
const dbModel = require('../models/model');
const {Category} = require("../models/model");

exports.getPostProductPage = async (req, res) => {
    const list = await dbModel.Brand.find();
    dbModel.Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('postproduct', {
                Category: foundList[0].list,
                Bra: list});
        }
    })
    // const cate = await dbModel.Category[0].list.find();

}
=======
const { Category } = require('../models/model');

exports.getPostProduct = async (req, res) => {
    const categoryList = await Category.find({});
    res.render('postproduct', { Category: categoryList[0].list });
}
>>>>>>> d181341dfd4c6978302d3a690e68f8cb8673ee6b
