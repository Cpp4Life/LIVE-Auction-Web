const express = require('express');
const mongoose = require('mongoose');
const dbModel = require('./models/model');
const _ = require('lodash');
const helper = require('./helpers/helper');

const app = express();

const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guest');
const sellerRoutes = require('./routes/seller')
// const guestController = require("../controllers/guest");

app.locals._ = _;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(guestRoutes);
app.use(sellerRoutes);

mongoose.connect('mongodb://localhost:27017/auctionDB');

app.listen(3000, () => console.log('Server running on port 3000'));

