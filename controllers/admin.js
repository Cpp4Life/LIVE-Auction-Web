const { User, Category } = require('../models/model');

var categoryList;
Category.find({}, (err, foundList) => {
    categoryList = foundList;
});

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

exports.getAdminSettings = (req, res) => {
    res.render('viewAdmin/settings', { Category: categoryList[0].list });
}

exports.getCategoryBrand = (req, res) => {
    console.log(req.params.brand);
}