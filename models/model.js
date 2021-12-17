const mongoose = require('mongoose');

// Specify possible schemas for database
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: String,
    address: String,
    reviewPoint: Number
});

const bidLogSchema = new mongoose.Schema({
    bidTime: Date,
    user: userSchema,
    bidPrice: Number
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    originalBidPrice: Number,
    boughtPrice: Number,
    currentPrice: Number,
    brand: String,
    subBrand: String,
    owner: userSchema,
    bidders: [bidLogSchema],
    timeStart: Date,
    timeRemaining: Date,
    description: String
});

const brandSchema = new mongoose.Schema({
    brand: String,
    subBrand: [String]
});

const categorySchema = new mongoose.Schema({
    list: [brandSchema]
});

// Initialize models corresponding to schemas
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);
const BidLog = mongoose.model('BidLog', bidLogSchema);
const Brand = mongoose.model('Brand', brandSchema);

module.exports = { User, Product, Category, BidLog, Brand };