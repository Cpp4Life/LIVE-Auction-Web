const { Category } = require('../models/model');

exports.getPostProduct = async (req, res) => {
    const categoryList = await Category.find({});
    res.render('postproduct', { Category: categoryList[0].list });
}