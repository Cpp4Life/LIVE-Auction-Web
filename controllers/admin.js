const { User, Category } = require('../models/model');

exports.getAdminLoginPage = async (req, res) => {
    const categoryList = await Category.find({});
    res.render('viewAdmin/admin-login', { Category: categoryList[0].list });
}

exports.postAdminLogin = async (req, res) => {
    const categoryList = await Category.find({});
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