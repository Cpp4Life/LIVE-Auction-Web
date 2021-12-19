require('dotenv').config();
const https = require('https');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const { User, Category } = require('../models/model');
const { response } = require('express');

exports.getLoginPage = (req, res) => {
    Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('login', { Category: foundList[0].list });
        }
    })
}

exports.getRegisterPage = (req, res) => {
    Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('register', { Category: foundList[0].list });
        }
    })
}

exports.postRegister = async (req, res, next) => {
    const categoryList = await Category.find({});
    const { name, email, password, password2 } = req.body;
    const captcha = req.body['g-recaptcha-response'];
    const errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (name.length > 20) {
        errors.push({ msg: 'Name in maximum of 20 characters' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password === undefined || password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (captcha === undefined || captcha === '' || captcha === null) {
        errors.push({ msg: 'Please check captcha box' });
        // return res.json({ 'success': false });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            Category: categoryList[0].list
        });
    } else {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = captcha;
        const remoteip = req.connection.remoteAddress;
        const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${response}&remoteip=${remoteip}`;

        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    Category: categoryList[0].list
                });
            } else {
                https.get(verifyURL, (response) => {
                    console.log('statusCode:', response.statusCode);
                    console.log('headers:', response.headers);

                    response.on('data', (data) => {
                        const reCaptchaData = JSON.parse(data);
                        console.log(reCaptchaData);
                        const successCode = reCaptchaData.success;

                        // Not successful
                        if (successCode !== undefined && !successCode) {
                            errors.push({ msg: 'Failed captcha verification' });
                            res.render('register', {
                                errors,
                                name,
                                email,
                                password,
                                password2,
                                Category: categoryList[0].list
                            });
                        } else {
                            // Successfully passed all verifications
                            const newUser = new User({
                                name,
                                email,
                                password,
                                role: 'bidder',
                                reviewPoint: 0
                            });

                            bcrypt.genSalt(saltRounds, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser
                                        .save()
                                        .then(user => {
                                            req.flash('success_msg', 'You are now registered and can log in');
                                            res.redirect('/user/login');
                                        })
                                        .catch(err => console.log(err));
                                });
                            });
                        }
                    });
                });
            }
        });
    }
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: req.session.returnTo,
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
    delete req.session.redirectTo;
}

exports.getLogout = (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
}