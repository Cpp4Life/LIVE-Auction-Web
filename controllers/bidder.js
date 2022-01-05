require('dotenv').config();
const { User, Category, Product} = require('../models/model');
const {MongoClient: mongoClient} = require("mongodb");
const express = require("express");
const multer  = require('multer')



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

    res.render('viewBidder/changepass' );
}
exports.editpassword = async (req, res) => {


}
