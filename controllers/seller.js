const fs = require('fs');
const dbModel = require('../models/model');
const { Category, Brand, Product, User} = require("../models/model");
const { MongoClient: mongoClient } = require("mongodb");
const multer = require('multer');
const date = require("date-and-time");
const bcrypt = require("bcrypt");
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
            console.log(req.body);
            var mongoClient = require('mongodb').MongoClient;
            var MGurl = "mongodb://localhost:27017/";
            mongoClient.connect(MGurl, function (err, db) {
                if (err) throw err;
                var dbo = db.db("auctionDB");

                var newProduct = new Product({
                    name: req.body.name,
                    originalBidPrice: req.body.startPrice,
                    boughtPrice: req.body.endPrice,
                    currentPrice: req.body.startPrice,
                    stepPrice: req.body.stepPrice,
                    brand: req.body.brand,
                    subBrand: req.body.subBrand,
                    owner: req.user,
                    timeStart: new Date().toLocaleDateString(),
                    timeEnd: new Date(req.body.datetime).toLocaleString(),
                    description: req.body.description,
                    topPrice: 0,
                    topOwner: {
                        image:   "262679398_417432213213287_2443858593223327537_n.png",
                    },
                    status: 1
                })

                dbo.collection("products").insertOne(newProduct, function (err, res) {
                    if (err) throw err;
                    console.log(req.params.id);

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


exports.editprofile  = async (req, res) =>  {
    const user = req.body;

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/images/Profile')
        },
        filename: function (req, file, cb) {
            cb(null,file.originalname);
        }
    });
    const upload = multer({storage});
    upload.single('fuMain')(req, res, function (err){
        console.log(req.file)
        if(err){
            console.error(err);
        }
        else
        {

            if(req.file == null){
                let currentUser = {
                    _id : req.params.id,
                    name : req.body.name,
                    email : req.body.email,
                    address: req.body.address,
                    phone: req.body.mobile
                };
                console.log(currentUser)
                User.findOneAndUpdate(
                    { _id: currentUser._id },
                    currentUser,
                    { new: true },
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );

                res.redirect('/seller/profile')
            }
            else {

                let currentUser = {
                    _id: req.params.id,
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                    phone: req.body.mobile,
                    image: req.file.filename
                };
                console.log(currentUser)
                User.findOneAndUpdate(
                    {_id: currentUser._id},
                    currentUser,
                    {new: true},
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );

                res.redirect('/seller/profile')
            }
        }
    })
}
exports.getPostchangepass = async (req, res) => {

    res.render('viewSeller/change-pass-seller' );
}
var pas1, pas2,pas3
exports.editpassword = async (req, res) => {
    // console.log(req.body)
    pas1= req.body.password1
    pas2= req.body.password2
    pas3= req.body.password3
    let currentUser = {
        _id: req.params.id,
        pas1 : req.body.password1
    };

    const errors = [];
    if (!pas1 || !pas2 || !pas3 ) {
        errors.push({ msg: 'Please enter all ' });
    }
    if (errors.length > 0) {
        res.render('viewSeller/change-pass-seller' , {
            errors,
        });
        console.log("hhi")
    }
    else
    {
        User.find({_id: currentUser._id}, function (err, user, done) {
            if (err) {
                errors.push({ msg: ' không tồn tại' });
                res.render('viewSeller/change-pass-seller' , {
                    errors,
                });
            }
            if (user) {
                bcrypt.compare(currentUser.pas1, user[0].password, (err, isMatch) => {
                    if (err) throw err;
                    if(!isMatch){
                        errors.push({ msg: ' Nhập sai mật khẩu ' });
                        res.render('viewSeller/change-pass-seller' , {
                            errors,
                        });
                    }
                    else {
                        const salt = bcrypt.genSaltSync(10, 'a');
                        pas2 = bcrypt.hashSync(pas2, salt)
                        console.log(pas2)
                        let newUser = {
                            _id: req.params.id,
                            password: pas2
                        };
                        bcrypt.compare(pas3, pas2, (err, isMatch) => {
                            if (err) throw err;
                            if(!isMatch){
                                errors.push({ msg: ' Nhập sai mật khẩu mới' });
                                res.render('viewSeller/change-pass-seller' , {
                                    errors,
                                });
                            }
                            else {
                                User.findOneAndUpdate(
                                    {_id: newUser._id},
                                    newUser,
                                    {new: true},
                                    (err, doc) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    }
                                );

                                res.redirect('/seller/profile')
                            }
                        });
                    }
                });
            }
        });
    }
}
