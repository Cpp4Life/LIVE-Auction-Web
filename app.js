require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// passport config
require('./config/passport')(passport);

const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guest');
const sellerRoutes = require('./routes/seller');
const bidderRoutes = require('./routes/bidder');

app.locals._ = _;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "Online Auction",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    if (req.user) { res.locals.user = req.user; }
    next();
});

// const str = _.snakeCase(helper.normalizeText('Thiết bị gia dụng'));
// console.log(str);

app.use(authRoutes);
app.use(guestRoutes);
app.use(sellerRoutes);
app.use(bidderRoutes);

mongoose.connect('mongodb://localhost:27017/auctionDB');

app.listen(3000, () => console.log('Server running on port 3000'));