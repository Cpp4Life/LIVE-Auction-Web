require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models/model');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({
                email: email.toLowerCase()
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/home'
    }, (accessToken, refreshToken, profile, cb) => {
        // console.log(profile);
        User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'password',
                    googleId: profile.id,
                    role: 'bidder'
                });
                user.save((err) => {
                    if (err) console.log(err);
                    return cb(err, user);
                });
            } else {
                return cb(err, user);
            }
        });
    }
    ));
};