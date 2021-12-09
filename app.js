const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.route('/viewproduct')
    .get((req, res) => {
        res.render('viewproduct')
    })
app.route('/')
    .get((req, res) => {
        res.render('home');
    });

app.route('/login')
    .get((req, res) => {
        res.render('login')
    })

app.route('/register')
    .get((req, res) => {
        res.render('register')
    })


app.listen(3000, () => console.log('Server running on port 3000'));
