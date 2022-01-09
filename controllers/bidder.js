require('dotenv').config();
const { User, Category, Product} = require('../models/model');
const {MongoClient: mongoClient} = require("mongodb");
const express = require("express");
const multer  = require('multer')
const bcrypt = require("bcrypt");



exports.getPostProfilePage = async (req, res) => {

    // res.render('viewBidder/bidder_profile' );

    Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('viewBidder/bidder-profile', { User: foundList[0].list });
        }
    })
}
var name, email, mobile, address,img;


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

                res.redirect('/bidder/profile')
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
                res.redirect('/bidder/profile')
            }
        }
    })


}

exports.getPostchangepass = async (req, res) => {

    res.render('viewBidder/change-pass' );
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
        res.render('viewBidder/change-pass', {
            errors,
        });
        console.log("hhi")
    }
    else
    {
        User.find({_id: currentUser._id}, function (err, user, done) {
            if (err) {
                errors.push({ msg: ' không tồn tại' });
                res.render('viewBidder/change-pass', {
                    errors,
                });
            }
            if (user) {
                bcrypt.compare(currentUser.pas1, user[0].password, (err, isMatch) => {
                    if (err) throw err;
                    if(!isMatch){
                        errors.push({ msg: ' Nhập sai mật khẩu ' });
                        res.render('viewBidder/change-pass', {
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
                                res.render('viewBidder/change-pass', {
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

                                res.redirect('/bidder/profile')
                            }
                        });
                    }
                });


            }
        });
    }
}



exports.getpostviewauction = async (req, res) => {
    res.render('viewBidder/bidder-Auction' );
}
exports.getviewauction = async (req, res) => {
    let currentUser = {
        _id: req.params.id,
    };
    const errors = [];

    console.log(req.params.id)
    User.find({_id: currentUser._id}, async function (err, user, done) {
        if (err) {
            errors.push({msg: ' không tồn tại'});
            res.render('viewBidder/bidder-Auction', {Category: categoryList[0].list,
                errors,
            });
        }
        if (user) {
            var i = 0;
            var sum = 0;
            var point = 0;
            for (i = 0; i < user[0].review.length; i++) {
                if (user[0].review[i].point == 1) {
                    point = point + 1;
                }
                sum = sum + 1;
            }
            console.log(point);
            if (point == 1) {
                const categoryList = await Category.find({});
                res.render('viewBidder/bidder-Auction', {Category: categoryList[0].list});
            }
            else{
                res.redirect('/bidder/profile')
            }
        }
    });

}

