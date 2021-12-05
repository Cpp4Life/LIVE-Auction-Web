const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.route('/')
    .get((req, res) => {
        res.render('register');
    });

app.listen(3000, () => console.log('Server running on port 3000'));
