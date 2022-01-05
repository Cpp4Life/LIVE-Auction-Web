require('dotenv').config();
const https = require('https');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const helper = require('../helpers/helper');
const { User, Category } = require('../models/model');

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

var otpGeneratedCode;
var name, email, password, password2, captcha ;

exports.postRegister = async (req, res, next) => {
    name = req.body.name;
    email = (req.body.email).toLowerCase();
    password = req.body.password;
    password2 = req.body.password2;
    captcha = req.body['g-recaptcha-response'];
    const categoryList = await Category.find({});
    const errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    } else if (name.length > 20) {
        errors.push({ msg: 'Name in maximum of 20 characters' });
    } else if (password === undefined || password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    } else if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    } else if (captcha === undefined || captcha === '' || captcha === null) {
        errors.push({ msg: 'Please check captcha box' });
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
        // const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const secretKey = '6Le1-LEdAAAAAGlij5NL99nsRJaUMUVt5lokJqsE';
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
                            otpGeneratedCode = helper.otpGenerator();
                            console.log(otpGeneratedCode);
                            helper.sendOtpMail(email, otpGeneratedCode);
                        }
                    });
                });
            }
        });
    }
}


exports.postVerifyOtp = async (req, res, next) => {
    const submittedOtp = req.body['digit-1'] + req.body['digit-2'] + req.body['digit-3'] + req.body['digit-4'] + req.body['digit-5'] + req.body['digit-6'];
    const errors = [];
    const categoryList = await Category.find({});

    if (!submittedOtp) {
        errors.push({ msg: 'Please enter OTP code' });
    } else if (submittedOtp.length != 6) {
        errors.push({ msg: 'OTP code must have 6 digits' });
    } else if (!submittedOtp.match(/^[0-9]+$/)) {
        errors.push({ msg: 'OTP contains only digits' });
    } else if (submittedOtp !== otpGeneratedCode) {
        errors.push({ msg: 'OTP codes do not match. Please check OTP code sent to your email again!' });
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
        const newUser = new User({
            name,
            email,
            password,
            role: 'bidder',
            reviewPoint: 0,
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
}

exports.postResendOtp = (req, res, next) => {
    otpGeneratedCode = helper.otpGenerator();
    console.log(`resend ${otpGeneratedCode}`);
    helper.sendOtpMail(email, otpGeneratedCode);
}

exports.getGoogleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.getHomeAfterGoogleAuth = (req, res, next) => {
    passport.authenticate('google', {
        successRedirect: req.session.returnTo || '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
    delete req.session.returnTo;
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: req.session.returnTo || '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
    delete req.session.returnTo;
}

exports.getLogout = (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
}