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
    var count = 0;
    const  url = './public/images/';
    fs.mkdirSync(url + 'newImages');
    const storage = multer.diskStorage({
        destination: function (req, res, cb){
            cb(null, url + 'newImages')
        },
        filename: function (req, file, cb){
            cb(null, count++ + '.jpg');
        }
    })

    const upload = multer({storage});
    upload.array('image', 5)
    (req, res, function (err){
        console.log(req.body);
        const { name, startPrice, stepprice, endPrice, mydecript, brand, subBrand, time } = req.body;
        const errors = [];

        if (!req.body.name || req.body.startPrice === 0|| req.body.stepprice === 0
            || !req.body.brand || !req.body.subBrand || req.body.time) {
            errors.push({ msg: 'Bạn phải điền đầy đủ thông tin' });
        }
        const myTimeRemain = new Date(req.body.datetime).getTime() - (new Date()).getTime();
        if(myTimeRemain < 0){
            errors.push({ msg: 'Lỗi!!! Ngày kết thúc không thể nhỏ hơn ngày bắt đầu' });
        }
        if (req.body.name.length > 50) {
            errors.push({ msg: 'Chiều dài tên không được vượt quá 50 kí tự' });
        }

        if (req.body.startPrice < 0 || req.body.stepprice < 0) {
            errors.push({ msg: 'Giá không được để số âm' });
        }
        if(req.body.endPrice !== 0){
            if (parseInt(req.body.startPrice) > parseInt(req.body.endPrice)) {
                errors.push({ msg: 'Invalid!! Giá mua ngay không thể nhỏ hơn giá ban đầu' });
            }
        }
        if (errors.length > 0) {
            fs.rmdir(url + 'newImages', { recursive: true }, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`deleted!`);
            });
            res.render('viewSeller/post-product', {
                errors,
                Category: categoryList[0].list
            });
        } else {
            var mongoClient = require('mongodb').MongoClient;
            var MGurl = "mongodb://localhost:27017/";
            mongoClient.connect(MGurl, function (err, db) {
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
                    console.log(newProduct.id);
                    // fs.mkdirSync(url + newProduct.id.toString());
                    fs.rename(url + 'newImages', url + newProduct.id, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Successfully renamed the directory.")
                        }
                    })
                    db.close();
                })
                res.render('viewSeller/post-product', {
                    Category: categoryList[0].list
                });
    })
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