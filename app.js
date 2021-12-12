const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guest');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(guestRoutes);

app.get('/postproduct', (req, res) => {
    res.render('postproduct');
})

app.listen(3000, () => console.log('Server running on port 3000'));
