const fs = require('fs');
const dbModel = require('../models/model');
const { Category, Brand, Product, User} = require("../models/model");
const { MongoClient: mongoClient } = require("mongodb");
const multer = require('multer');
const date = require("date-and-time");
const bcrypt = require("bcrypt");
const username = 'hieule';
const swal = require('sweetalert');
const helper = require('../helpers/helper');
exports.getPostProductPage = async (req, res) => {
    const categoryList = await Category.find({});
    res.render('viewSeller/post-product', { success: '',Category: categoryList[0].list });
}
exports.getProductselling = async (req,res) =>{
    dbModel.User.find({}, (err, user) => {
            dbModel.Product.find({}, (err, ProductList) => {
                    if (err)
                        console.log(err);
                    else {
                        dbModel.Category.find({}, (err, CategoryList) => {
                            if (err)
                                console.log(err);
                            else {

                                res.render('viewSeller/seller-profile', {
                                    User: user,
                                    Product: ProductList,
                                    Category: CategoryList[0].list
                                });
                            }
                        })

                    }
                }
            )
        }
    )
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
        console.log(!req.body.datetime);
        const errors = [];
        if (!req.body.name || req.body.startPrice === 0|| req.body.stepprice === 0
            || !req.body.brand || !req.body.subBrand || !req.body.datetime) {
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
                success: "",
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
                    timeStart: new Date(),
                    timeEnd: new Date(req.body.datetime).toLocaleString(),
                    description: req.body.description,
                    topPrice: 0,
                    status: 1,
                    topOwner: {
                        image:   "262679398_417432213213287_2443858593223327537_n.png",
                    }
                })

                dbo.collection("products").insertOne(newProduct, function (err, res) {
                    if (err) throw err;
                    // console.log(req.params.id);

                    // console.log(newProduct.id);

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
                res.render('viewSeller/post-product', {success: 'Đăng sản phẩm thành công',
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
exports.postedownvotebidder = async (req, res) => {
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



    res.redirect("/seller/profile")

};

exports.posteditinfomation = async (req, res) => {
    const errors = [];


    Product.find({_id: req.params.id}, async function (err, product, done) {
        if (err) {
            console.log(err)
        }
        if (product) {

            var edit = product[0].description + req.body.description
                let newproduct = {
                    description: edit,
                };
                Product.findOneAndUpdate(
                    {_id: req.params.id},
                    newproduct,
                    {new: true},
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );

            }
        }
    )
    res.redirect("/view-product-list/view-product/"+ req.params.id)

};
exports.postevaluatebidder = async (req, res) => {
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



    res.redirect("/seller/profile")

};

// chu3a hoan thành
exports.postkickbidder = async (req, res) => {
    const errors = [];
    var arr = req.params.id.split("+")


    Product.find({_id: arr[1]}, async function (err, product, done) {
            if (err) {
                console.log(err)
            }
            if (product) {
                User.find({}, async function (err, user, done) {
                        if (err) {
                            console.log(err)
                        }
                        if (user) {
                            if(product[0].bidders.length === 1){


                                let newproduct = {
                                    currentPrice: product[0].originalBidPrice,
                                    topOwner :  {


                                    }
                                };
                                Product.findOneAndUpdate(
                                    {_id:arr[1]},
                                    newproduct,
                                    {new: true},
                                    (err, doc) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    }
                                );
                                res.redirect("/seller/profile")
                            }
                            if(product[0].bidders.length > 1){
                                var arr1= []
                                var check= product[0].bidders[product[0].bidders.length -1].user.id
                                arr1.push(product[0].bidders[product[0].bidders.length -1].user.id)
                                for (let i = product[0].bidders.length -2 ; i > 0; i--) {
                                    if (!(product[0].bidders[i].user._id.equals( check))) {
                                        arr1.push(product[0].bidders[i].user.id)
                                        check=product[0].bidders[i].user.id
                                    }
                                }

                                var j=0;
                                for (let i = 0 ; i < arr1.length; i++) {
                                    if ((arr1[i] === arr[0])) {
                                        j=i;
                                        break;
                                    }
                                }
                                console.log(arr1[j])
                                if(j==0){
                                    for (let i = product[0].bidders.length -1 ; i > 0; i--) {
                                        if (!(product[0].bidders[i].user._id.equals( arr[0]))) {
                                            let newproduct = {

                                                topOwner :   product[0].bidders[i].user,
                                                topPrice: product[0].bidders[i].user.bidPrice,
                                                currentPrice: product[0].bidders[i].user.bidPrice,

                                            };
                                            Product.findOneAndUpdate(
                                                {_id:arr[1]},
                                                newproduct,
                                                {new: true},
                                                (err, doc) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                }
                                            );
                                            res.redirect("/seller/profile")
                                            break;
                                        }
                                     }

                                }if(j >0 && j<arr1.length ){
                                    for (let i = product[0].bidders.length -1 ; i > 0; i--) {
                                            if(product[0].bidders[i].user.id === arr1[j +1]  ){
                                                let newproduct = {

                                                    topOwner :   product[0].bidders[i].user,
                                                    topPrice: product[0].bidders[i].user.bidPrice,
                                                    currentPrice: product[0].bidders[i].user.bidPrice,

                                                };
                                                Product.findOneAndUpdate(
                                                    {_id:arr[1]},
                                                    newproduct,
                                                    {new: true},
                                                    (err, doc) => {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                    }
                                                );
                                                res.redirect("/seller/profile")
                                                break;
                                            }
                                    }

                                } if(j == arr1.length -1 ){

                                    let newproduct = {

                                        topOwner :  {


                                        }
                                    };
                                    Product.findOneAndUpdate(
                                        {_id:arr[1]},
                                        newproduct,
                                        {new: true},
                                        (err, doc) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                        }
                                    );
                                    res.redirect("/seller/profile")

                                }

                            }
                        }
                    }
                )

                // var edit = product[0].description + req.body.description
                // let newproduct = {
                //     description: edit,
                // };
                // Product.findOneAndUpdate(
                //     {_id: req.params.id},
                //     newproduct,
                //     {new: true},
                //     (err, doc) => {
                //         if (err) {
                //             console.log(err);
                //         }
                //     }
                // );

            }
        }
    )


};