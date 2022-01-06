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
            res.render('viewAdmin/admin_login', { Category: categoryList[0].list });
        }
        if (foundUser) {
            console.log(foundUser);
        } else {
            errors.push({ msg: 'Incorrect administrator login!' });
            res.render('viewAdmin/admin_login', {
                errors,
                Category: categoryList[0].list
            });
        }
    });
}