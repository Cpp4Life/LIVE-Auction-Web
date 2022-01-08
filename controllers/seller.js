const fs = require('fs');
const dbModel = require('../models/model');
const { Category, Brand, Product } = require("../models/model");
const { MongoClient: mongoClient } = require("mongodb");
const multer = require('multer');
const date = require("date-and-time");
const username = 'hieule';
// const upload = nulter({dest: 'uploads/'});
exports.getPostProductPage = async (req, res) => {
    const categoryList = await Category.find({});
    res.render('viewSeller/post-product', { Category: categoryList[0].list });
}

exports.postProduct = async (req, res) => {
    const categoryList = await Category.find({});
    var idProduct;
    var count = 0;
    const storage = multer.diskStorage({
        destination: function (req, res, cb){
            cb(null, './public/images')
        },
        filename: function (req, file, cb){
            cb(null, count++ + '.jpg');
        }
    })

    console.log(req.body);
    const upload = multer({storage});
    console.log(req.body);
    upload.array('image', 5)
    (req, res, function (err){

        const { name, startPrice, stepprice, endPrice, mydecript, brand, subBrand, time } = req.body;
        const errors = [];
        const myTimeRemain = new Date(req.body.datetime).getTime() - (new Date()).getTime();
        if(myTimeRemain < 0){
            errors.push({ msg: 'Datetime error. Please enter again' });
        }
        // if (!name || !startPrice || !stepprice) {
        //     errors.push({ msg: 'Please enter all fields required' });
        // }
        if (name.length > 50) {
            errors.push({ msg: 'Name in maximum of 50 characters' });
        }

        if (startPrice < 0 || endPrice < 0 || stepprice < 0) {
            errors.push({ msg: 'You can not enter negative number' });
        }
        if (endPrice < startPrice) {
            errors.push({ msg: 'Invalid!! Giá mua ngay không thể nhỏ hơn giá ban đầu' });
        }
        if (errors.length > 0) {
            res.render('viewSeller/post-product', {
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
                    boughtPrice: endPrice,
                    currentPrice: startPrice,
                    stepPrice: stepprice,
                    brand: brand,
                    subBrand: subBrand,
                    timeStart: new Date().toLocaleDateString(),
                    timeEnd: new Date(req.body.datetime).toLocaleString(),
                    description: req.body.description

                })
                dbo.collection("products").insertOne(newProduct, function (err, res) {
                    if (err) throw err;
                    idProduct = newProduct.id;
                    db.close();
                })
                //chèn hình ảnh trước nè
                res.render('viewSeller/post-product', {
                    Category: categoryList[0].list
                });
    })
            // var url = './public/images/' + idProduct;
            // var count = 0;
            // console.log(req.body);
            // fs.mkdirSync(url);
            // const storage1 = multer.diskStorage({
            //     destination: function (req, res, cb){
            //         cb(null, url)
            //     },
            //     filename: function (req, file, cb){
            //         cb(null, count++ + '.jpg');
            //     }
            // })
            // const upload = multer({storage1});
            // upload.array('image', 5)
            // //thêm dữ liệu vào database


}})}
function secondsToDhms(seconds) {
    seconds = Number(seconds/1000);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}