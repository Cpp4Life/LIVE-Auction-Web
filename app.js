const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const session = require('express-session');
const passport = require('passport');

const helper = require('./helpers/helper');

const app = express();

// passport config
require('./config/passport')(passport);

const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guest');

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

app.use(authRoutes);
app.use(guestRoutes);

mongoose.connect('mongodb://localhost:27017/auctionDB');

app.listen(3000, () => console.log('Server running on port 3000'));
