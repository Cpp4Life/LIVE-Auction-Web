
const dbModel = require('../models/model');
const { Category, Brand, Product } = require("../models/model");
const { MongoClient: mongoClient } = require("mongodb");

exports.getPostProductPage = async (req, res) => {
    const categoryList = await Category.find({});
    res.render('viewSeller/post_product', { Category: categoryList[0].list });
}

exports.postProduct = async (req, res) => {
    const categoryList = await Category.find({});
    console.log(req.body);
    //Tạo biến datetime
    // const d = new Date();

    const { name, startPrice, stepPrice, endPrice, decription, brand, subBrand, date } = req.body;
    const errors = [];
    if (!name || !startPrice || !stepPrice || !brand || !subBrand) {
        errors.push({ msg: 'Please enter all fields requied' });
    }
    if (name.length > 20) {
        errors.push({ msg: 'Name in maximum of 20 characters' });
    }

    if (startPrice < 0 || endPrice < 0 || stepPrice < 0 || period < 0) {
        errors.push({ msg: 'You can not enter negative number' });
    }
    if (endPrice < startPrice) {
        errors.push({ msg: 'Invalid!! Giá mua ngay không thể nhỏ hơn giá ban đầu' });
    }

    // if(period > 7){
    //     errors.push({msg: 'Không thể đăng một sản phẩm quá 7 ngày'});
    // }
    // const endDay = new Date(date);
    // Date endDay = new Date(date);
    // console.log(endDay);
    // console.log(d);
    // if(d.getTime() > Date.parse(endDay).getTime()){
    //     errors.push({msg: 'Invalid input datetime'});
    // }



    if (errors.length > 0) {
        res.render('viewSeller/post_product', {
            errors,
            Category: categoryList[0].list
        });
    } else {
        var mongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        mongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("auctionDB");
            var newProduct = new Product({
                name: name,
                originalBidPrice: startPrice,
                currentPrice: startPrice,
                boughtPrice: endPrice,
                brand: brand,
                subBrand: subBrand,
                timeStart: d,
                // timeRemaining: date.getTime() - Date(endDay).getTime(),
                description: decription
            })
            dbo.collection("products").insertOne(newProduct, function (err, res) {
                if (err) throw err;
                console.log(newProduct);
                console.log('1 product inserted');
                db.close();

            })
            res.render('viewSeller/post_product', {
                Category: categoryList[0].list
            });
        });
    }
}
