const express = require('express');
const mongoose = require('mongoose');

const app = express();

const guestRoutes = require('./routes/guest');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(guestRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
