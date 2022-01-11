const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const helper = require('../helpers/helper');
const { User, Category, Brand } = require('../models/model');

exports.getAdminLoginPage = async (req, res) => {
    const categoryList = await Category.find({});
    res.render('viewAdmin/admin-login', { Category: categoryList[0].list });
}

exports.postAdminLogin = async (req, res) => {
    const categoryList = await Category.find({});
    const { username, password } = req.body;
    const errors = [];

    User.findOne({ email: username, password: password }, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        if (foundUser) {
            res.redirect('/admin/settings');
        } else {
            errors.push({ msg: 'Mật khẩu không đúng!' });
            res.render('viewAdmin/admin-login', {
                errors,
                Category: categoryList[0].list
            });
        }
    });
}

exports.getAdminSettings = async (req, res) => {
    const categoryList = await Category.find({});
    const userList = await User.find({});
    res.render('viewAdmin/settings', {
        Category: categoryList[0].list,
        User: userList
    });
}

exports.postCategory = async (req, res) => {
    const categoryList = await Category.find({});
    const userList = await User.find({});
    const submittedBrand = req.body.brand;
    const submittedSubBrand = req.body.subBrand;
    const errors = [];

    Brand.findOne({ brand: submittedBrand }, (err, foundList) => {
        if (err) console.log(err);

        if (foundList) {
            console.log('Old Brand');
            if (foundList.subBrand.includes(submittedSubBrand)) {
                errors.push({ msg: 'Mặt hàng và loại sản phẩm đã tồn tại!' });
            } else {
                errors.push({ msg: 'Nhấn chọn sửa danh mục để thêm loại sản phẩm mới!' });
            }
            res.render('viewAdmin/settings', {
                errors,
                Category: categoryList[0].list,
                User: userList
            });
        } else {
            console.log('New Brand');
            const subBrandItems = [submittedSubBrand];
            const newBrand = new Brand({
                brand: submittedBrand,
                subBrand: subBrandItems
            });

            const objectId = categoryList[0]._id;

            Category.updateOne({ _id: objectId }, { $push: { list: [newBrand] } }, (err, result) => {
                if (err)
                    console.log(err);
            });

            newBrand.save(err => {
                if (err)
                    console.log(err);
                else
                    res.redirect('/admin/settings');
            });
        }
    })
}

exports.getCategoryBrand = async (req, res) => {
    const categoryList = await Category.find({});
    const userList = await User.find({});
    const brandList = await Brand.find({});
    const submittedBrand = req.params.brand;

    for (var i = 0; i < brandList.length; i++) {
        const currentBrand = _.kebabCase(helper.normalizeText(brandList[i].brand));
        if (currentBrand === submittedBrand) {
            res.render('viewAdmin/brand-list', {
                Category: categoryList[0].list,
                brandTitle: brandList[i].brand,
                subBrandList: brandList[i].subBrand
            });
            break;
        }
    }

    res.render('viewAdmin/settings', {
        Category: categoryList[0].list,
        User: userList
    });
}

exports.postDelBrandItem = async (req, res) => {
    const categoryList = await Category.find({});
    const checkedItem = req.body.checkbox;
    const brandName = req.body.brandName;

    Category.findOne({ "list.brand": brandName },
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                for (var i = 0; i < result.list.length; i++) {
                    if (result.list[i].brand === brandName) {
                        const index = result.list[i].subBrand.indexOf(checkedItem);
                        if (index > -1) {
                            result.list[i].subBrand.splice(index, 1);
                        }
                        if (result.list[i].subBrand.length === 0) {
                            result.list.splice(i, 1);
                        }
                        result.save(err => {
                            if (err) console.log(err);
                        });
                        break;
                    }
                }
            }
        }
    );

    Brand.find({},
        (err, result) => {
            if (err)
                console.log(err);
            else {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].brand === brandName) {
                        const index = result[i].subBrand.indexOf(checkedItem);
                        if (index > -1) {
                            result[i].subBrand.splice(index, 1);
                            if (result[i].subBrand.length === 0) {
                                const objectId = result[i]._id;
                                Brand.findByIdAndDelete({ _id: objectId }, (deleteErr) => {
                                    if (deleteErr) {
                                        console.log(deleteErr);
                                    }
                                });
                            } else {
                                result[i].save(err => {
                                    if (err) console.log(err);
                                });
                            }
                        }
                        try {
                            res.redirect('/admin/settings/category/' + _.kebabCase(helper.normalizeText(brandName)));
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        });
}

exports.postAddBrandItem = async (req, res) => {
    const categoryList = await Category.find({});
    const itemName = req.body.newItem;
    const brandName = req.body.brand;
    const errors = [];

    Category.findOne({ "list.brand": brandName },
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                for (var i = 0; i < result.list.length; i++) {
                    if (result.list[i].brand === brandName) {
                        const index = result.list[i].subBrand.indexOf(itemName);
                        if (index === -1) {
                            result.list[i].subBrand.push(itemName);
                            result.save(err => {
                                if (err) console.log(err);
                            });
                            Brand.updateOne({ brand: brandName }, { $push: { subBrand: itemName } },
                                (err, result) => {
                                    if (err) console.log(err);
                                    res.redirect('/admin/settings/category/' + _.kebabCase(helper.normalizeText(brandName)));
                                }
                            );
                        } else {
                            errors.push({ msg: 'Loại sản phẩm đã tồn tại!' });
                            res.render('viewAdmin/brand-list', {
                                errors,
                                Category: categoryList[0].list,
                                brandTitle: result.list[i].brand,
                                subBrandList: result.list[i].subBrand
                            });
                        }
                        break;
                    }
                }
            }
        }
    );
}

exports.postAccounts = async (req, res) => {
    const action = req.body.action;
    const email = req.body.email;

    if (action === 'delete') {
        User.deleteOne({ email: email }, err => {
            if (err)
                console.log(err);
        });
    } else if (action === 'reset') {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash('@Password123', salt, (err, hash) => {
                if (err) throw err;
                User.findOneAndUpdate({ email: email }, { password: hash }, (err, result) => {
                    if (err) throw (err);
                    if (result) {
                        helper.sendNewPassword(email, '@Password123');
                    } else {
                        console.log('User not found');
                    }
                });
            });
        });
    }
    res.redirect('/admin/settings');
}