const helper = require('../helpers/helper');
const _ = require('lodash');
const { User, Category, Brand } = require('../models/model');
const { isBuffer } = require('lodash');

exports.getAdminLoginPage = (req, res) => {
    res.render('viewAdmin/admin-login', { Category: categoryList[0].list });
}

exports.postAdminLogin = (req, res) => {
    const { username, password } = req.body;
    const errors = [];
    console.log(req.body);

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
    res.render('viewAdmin/settings', { Category: categoryList[0].list });
}

exports.postCategory = async (req, res) => {
    const categoryList = await Category.find({});
    const submittedBrand = req.body.brand;
    const submittedSubBrand = req.body.subBrand;
    console.log(submittedBrand + ' ' + submittedSubBrand);
    const errors = [];

    Brand.findOne({ brand: submittedBrand }, (err, foundList) => {
        if (err) console.log(err);

        if (foundList) {
            console.log('Brand existed');
            if (foundList.subBrand.includes(submittedSubBrand)) {
                errors.push({ msg: 'Mặt hàng và loại sản phẩm đã tồn tại!' });
            } else {
                errors.push({ msg: 'Nhấn chọn sửa danh mục để thêm loại sản phẩm mới!' });
            }
            res.render('viewAdmin/settings', {
                errors,
                Category: categoryList[0].list
            });
        } else {
            console.log('New Brand');
            const subBrandItems = [submittedSubBrand];
            const newBrand = new Brand({
                brand: submittedBrand,
                subBrand: subBrandItems
            });

            const objectId = categoryList[0]._id;
            console.log(objectId);

            Category.updateOne({ _id: objectId }, { $push: { list: [newBrand] } }, (err, result) => {
                if (err)
                    console.log(err);
                console.log(result);
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
    const submittedBrand = req.params.brand;
    Brand.find({}, (err, result) => {
        for (var i = 0; i < result.length; i++) {
            const currentBrand = _.kebabCase(helper.normalizeText(result[i].brand));
            if (submittedBrand === currentBrand) {
                res.render('viewAdmin/brand-list', {
                    Category: categoryList[0].list,
                    brandTitle: result[i].brand,
                    subBrandList: result[i].subBrand
                });
            }
        }
    })
}

exports.postDelBrandItem = (req, res) => {
    const checkedItem = req.body.checkbox;
    const brandName = req.body.brandName;

    Category.findOne({ "list.brand": brandName },
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                for (var i = 0; i < result.list.length; i++) {
                    if (result.list[i].brand === brandName) {
                        const index = result.list[i].subBrand.indexOf(checkedItem);
                        if (index > -1) {
                            result.list[i].subBrand.splice(index, 1);
                        }
                        if (result.list[i].subBrand.length === 0) {
                            result.list.splice(i, 1);
                            Brand.findOneAndDelete({ brand: brandName }, (err, result) => {
                                if (err) console.log(err);
                            });
                            res.redirect('/admin/settings');
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

    Brand.updateOne({ brand: brandName }, { $pull: { subBrand: checkedItem } },
        (err, result) => {
            if (err) console.log(err);
            res.redirect('/admin/settings/category/' + _.kebabCase(helper.normalizeText(brandName)));
        }
    );
}

exports.postAddBrandItem = async (req, res) => {
    console.log(req.body);
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