const { User, Category, Brand } = require('../models/model');

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

exports.postCategory = (req, res) => {
    const submittedBrand = req.body.brand;
    const submittedSubBrand = req.body.subBrand;
    console.log(submittedBrand + ' ' + submittedSubBrand);

    Brand.findOne({ brand: submittedBrand }, (err, foundList) => {
        if (err) console.log(err);

        if (foundList) {
            console.log('Brand existed');
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
    // res.redirect('/admin/settings');
}

exports.getCategoryBrand = (req, res) => {
    console.log(req.params.brand);
}