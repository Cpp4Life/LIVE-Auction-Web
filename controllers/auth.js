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

exports.getForgotPasswordPage = (req, res) => {
    Category.find({}, (err, foundList) => {
        if (err)
            console.log(err);
        else {
            res.render('forgot-password', { Category: foundList[0].list });
        }
    })
}

var otpGeneratedCode;
var name, email, password, password2, captcha;

exports.postRegister = async (req, res, next) => {
    name = req.body.name;
    email = (req.body.email).toLowerCase();
    password = req.body.password;
    password2 = req.body.password2;
    captcha = req.body['g-recaptcha-response'];
    const categoryList = await Category.find({});
    const errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Hãy nhập tất cả thông tin!' });
    } else if (!(/@gmail\.com$/.test(email))) {
        errors.push({ msg: 'Hãy nhập gmail hợp lệ!' });
    } else if (name.length > 20) {
        errors.push({ msg: 'Họ tên không được vượt quá 20 ký tự!' });
    } else if (password === undefined || password.length < 6) {
        errors.push({ msg: 'Mật khẩu phải ít nhất 6 ký tự!' });
    } else if (password != password2) {
        errors.push({ msg: 'Mật khẩu không trùng nhau!' });
    } else if (captcha === undefined || captcha === '' || captcha === null) {
        errors.push({ msg: 'Xin đánh vào reCaptcha!' });
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
                errors.push({ msg: 'Email đã tồn tại' });
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

exports.postForgotPassword = async (req, res) => {
    console.log(req.body);
    email = (req.body.email).toLowerCase();
    const errors = [];
    const categoryList = await Category.find({});
    if (!email)
        errors.push({ msg: 'Nhập email để nhận mã OTP!' });
    else if (!(/@gmail\.com$/.test(email)))
        errors.push({ msg: 'Hãy nhập gmail hợp lệ!' });

    if (errors.length > 0) {
        res.render('forgot-password', {
            email,
            errors,
            Category: categoryList[0].list
        });
    } else {
        User.findOne({ 'email': email }, (err, foundUser) => {
            if (err) console.log(err);
            if (!foundUser) {
                errors.push({ msg: 'Email không tồn tại!' });
                res.render('forgot-password', {
                    email,
                    errors,
                    Category: categoryList[0].list
                });
            } else {
                otpGeneratedCode = helper.otpGenerator();
                console.log(otpGeneratedCode);
                helper.sendOtpMail(email, otpGeneratedCode);
            }
        })
    }
}

exports.postVerifyOtp = async (req, res, next) => {
    const submittedOtp = req.body['digit-1'] + req.body['digit-2'] + req.body['digit-3'] + req.body['digit-4'] + req.body['digit-5'] + req.body['digit-6'];
    const errors = [];
    const categoryList = await Category.find({});

    if (!submittedOtp) {
        errors.push({ msg: 'Xin nhập mã OTP!' });
    } else if (submittedOtp.length != 6) {
        errors.push({ msg: 'Mã OTP phải chứa 6 chữ số!' });
    } else if (!submittedOtp.match(/^[0-9]+$/)) {
        errors.push({ msg: 'Mã OTP không được chứa ký tự alphabet!' });
    } else if (submittedOtp !== otpGeneratedCode) {
        errors.push({ msg: 'Mã OTP không trùng. Xin kiểm tra lại mã OTP được gửi đến email của bạn!' });
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
            review : [ ],
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

exports.postForgotPasswordVerifyOtp = async (req, res, next) => {
    const submittedOtp = req.body['digit-1'] + req.body['digit-2'] + req.body['digit-3'] + req.body['digit-4'] + req.body['digit-5'] + req.body['digit-6'];
    const errors = [];
    const categoryList = await Category.find({});

    if (!submittedOtp) {
        errors.push({ msg: 'Xin nhập mã OTP!' });
    } else if (submittedOtp.length != 6) {
        errors.push({ msg: 'Mã OTP phải chứa 6 chữ số!' });
    } else if (!submittedOtp.match(/^[0-9]+$/)) {
        errors.push({ msg: 'Mã OTP không được chứa ký tự alphabet!' });
    } else if (submittedOtp !== otpGeneratedCode) {
        errors.push({ msg: 'Mã OTP không trùng. Xin kiểm tra lại mã OTP được gửi đến email của bạn!' });
    }

    if (errors.length > 0) {
        res.render('forgot-password', {
            email,
            errors,
            Category: categoryList[0].list
        });
    } else {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash('@Password123', salt, (err, hash) => {
                console.log(hash);
                if (err) throw err;
                User.findOneAndUpdate({ email: email }, { password: hash }, (err, result) => {
                    if (err) throw (err);
                    if (result) {
                        helper.sendNewPassword(email, '@Password123');
                        res.redirect('/user/login');
                    } else {
                        res.redirect('/user/forgot-password');
                    }
                });
            });
        });
    }
}

exports.postForgotPasswordResendOtp = (req, res, next) => {
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