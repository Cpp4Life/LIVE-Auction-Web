const dbModel = require('../models/model');

exports.getLoginPage = (req, res) => {
    dbModel.Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('login', { Category: foundList[0].list });
        }
    })
}

exports.getRegisterPage = (req, res) => {
    dbModel.Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('register', { Category: foundList[0].list });
        }
    })
}