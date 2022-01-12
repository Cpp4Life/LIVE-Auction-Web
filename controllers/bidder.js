require('dotenv').config();
const { User, Category, Product} = require('../models/model');
const {MongoClient: mongoClient} = require("mongodb");
const express = require("express");
const multer  = require('multer')
const bcrypt = require("bcrypt");
const dbModel = require("../models/model");



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


exports.getbidderprofile = async ( req, res) =>{
    dbModel.User.find({}, (err, user) => {
        dbModel.Product.find({}, (err, ProductList) => {
                if (err)
                    console.log(err);
                else {
                    dbModel.Category.find({}, (err, CategoryList) => {
                        if (err)
                            console.log(err);
                        else {
                            res.render('viewBidder/bidder-profile', {
                                User: user,
                                Product: ProductList,
                                Category: CategoryList[0].list
                            });
                        }
                    })

                }
            }
        )
    })
}

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
                // console.log(currentUser)
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
                // console.log(currentUser)
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

exports.postedownvoteSeller = async (req, res) => {
    const errors = [];
    console.log(req.params);
    console.log(req.body.rate1)
    var arr = req.params.id.split("+")
    User.find({_id: arr[0]}, async function (err, user1, done) {
        if (err) {
            console.log(err)
        }
        if (user1) {
            User.find({_id: arr[1]}, async function (err, user, done) {

                if (err) {
                    console.log(err)
                }
                if (user) {
                    var check= true;

                    for(var i=0;i<user1[0].review.length;i++){
                        if((arr[2]) == (user1[0].review[i].product_id)){
                            check= false;
                        }
                    }
                    if(check) {
                        let currentUser = {
                            $push: {
                                review: {
                                    user_id: arr[1],
                                    product_id: arr[2],
                                    name_rv: user[0].name,
                                    comment: req.body.rate1,
                                    point: -1,

                                }
                            }
                        };
                        User.findOneAndUpdate(
                            {_id: arr[0]},
                            currentUser,
                            {new: true},
                            (err, doc) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );

                    }
                }
            });
        }
    });



    res.redirect("/bidder/profile")

};
exports.postevaluateSeller = async (req, res) => {
    const errors = [];
    console.log(req.params);
    console.log(req.body.rate)
    var arr = req.params.id.split("+")
    User.find({_id: arr[0]}, async function (err, user1, done) {
        if (err) {
            console.log(err)
        }
        if (user1) {
            User.find({_id: arr[1]}, async function (err, user, done) {

                if (err) {
                    console.log(err)
                }
                if (user) {
                    var check= true;

                    for(var i=0;i<user1[0].review.length;i++){
                        if((arr[2]) == (user1[0].review[i].product_id)){
                            check= false;
                        }
                    }
                    if(check) {
                        let currentUser = {
                            $push: {
                                review: {
                                    user_id: arr[1],
                                    product_id: arr[2],
                                    name_rv: user[0].name,
                                    comment: req.body.rate,
                                    point: 1,

                                }
                            }
                        };
                        User.findOneAndUpdate(
                            {_id: arr[0]},
                            currentUser,
                            {new: true},
                            (err, doc) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );

                    }
                }
            });
        }
    });



  res.redirect("/bidder/profile")

};

exports.getfavorites = async (req, res) => {
    let currentUser = {
        _id: req.params.id,
    };
    var id_user= req.params.id.split("+")
    const errors = [];

    console.log(req.params.id)
    console.log(id_user)

    User.find({_id: id_user[0]}, async function (err, user, done) {
        if (err) {
           console.log(err)
        }
        if (user) {
            var check=0;
            var i;
            console.log(user[0].favorites.length)
            for( i=0;i< user[0].favorites.length;i++){
                var x=user[0].favorites[i].id_product
                if(id_user[1] == x){
                    check=1;
                }
            }
            Product.find({_id: id_user[1]}, async function (err, product, done) {

            let currentproduct = {
                name: product[0].name,
                timest: product[0].timeStart,
                timeend:product[0].timeEnd,
                current: product[0].currentPrice
            };

            let currentUser = {
                 $push : { favorites:   {
                     id_product: id_user[1],
                     name_product: currentproduct.name,
                     timeStart_product:currentproduct.timest,
                     timeEnd_product:currentproduct.timeend,
                     currentPrice_product:currentproduct.current,

                 } }
            };
            if(check==0) {
                console.log(currentUser)
                User.findOneAndUpdate(
                    {_id: id_user[0]},
                    currentUser,
                    {new: true},
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
                const categoryList = await Category.find({});

                res.redirect('/view-product-list/view-product/' + id_user[1])
            }
            else{
                let currentUser = {
                    $pull : { favorites:   {
                            id_product: id_user[1],
                            name_product: currentproduct.name,
                            timeStart_product:currentproduct.timest,
                            timeEnd_product:currentproduct.timeend,
                            currentPrice_product:currentproduct.current,

                        } }
                };
                User.findOneAndUpdate(
                    {_id: id_user[0]},
                    currentUser,
                    {new: true},
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
                res.redirect('/view-product-list/view-product/' + id_user[1])
            }
            })
        }
    });

}



// exports.getpostviewauction = async (req, res) => {
//     res.render('viewBidder/bidder-Auction' );
// }
// exports.getviewauction = async (req, res) => {
//     let currentUser = {
//         _id: req.params.id,
//     };
//     const errors = [];
//
//     console.log(req.params.id)
//     User.find({_id: currentUser._id}, async function (err, user, done) {
//         if (err) {
//             errors.push({msg: ' không tồn tại'});
//             res.render('viewBidder/bidder-Auction', {Category: categoryList[0].list,
//                 errors,
//             });
//         }
//         if (user) {
//             // var i = 0;
//             // var sum = 0;
//             // var point = 0;
//             // for (i = 0; i < user[0].review.length; i++) {
//             //     if (user[0].review[i].point == 1) {
//             //         point = point + 1;
//             //     }
//             //     sum = sum + 1;
//             // }
//             // console.log(point);
//             // if (point == 1) {
//                 const categoryList = await Category.find({});
//                 res.render('viewBidder/bidder-Auction', {Category: categoryList[0].list});
//             // }
//             // else{
//             //     res.redirect('/bidder/profile')
//             // }
//         }
//     });
//
// }

