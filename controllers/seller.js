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
