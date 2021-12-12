const { Product } = require("../models/model");

exports.getHomePage = (req, res) => {
    res.render('home');
}
