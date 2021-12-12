const { User } = require('../models/model');

exports.getLoginPage = (req, res) => {
    res.render('login');
}

exports.getRegisterPage = (req, res) => {
    res.render('register');
}