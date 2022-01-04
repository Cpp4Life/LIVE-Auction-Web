require('dotenv').config();
const https = require('https');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const helper = require('../helpers/helper');
const { User, Category, Product} = require('../models/model');
const {MongoClient: mongoClient} = require("mongodb");




exports.getPostProfilePage = async (req, res) => {

    // res.render('viewBidder/bidder_profile' );

    Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('viewBidder/bidder-profile', { Category: foundList[0].list });
        }
    })
}
var name, email, mobile, address;

exports.editprofile  = async (req, res) =>  {
    const user = req.body;
    console.log(req.params.id)
    let currentUser = {
        _id : req.params.id,
        name : req.body.name,
        email : req.body.email,
        address: req.body.address,
        phone: req.body.mobile
    };
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

exports.getPostchangepass = async (req, res) => {

    res.render('viewBidder/changepass' );
}
exports.editpassword = async (req, res) => {


}
