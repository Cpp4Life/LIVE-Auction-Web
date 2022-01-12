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
                    return done(null, false, { message: 'Email này chưa được đăng ký!' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Mật khẩu không đúng!' });
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



    // passport.use(new GoogleStrategy({
    //     clientID:  430628000423-snc4munnnsgs606d70tkgr06mb7p6umn.apps.googleusercontent.com,
    //     clientSecret: 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,
    //     callbackURL: 'http://localhost:3000/auth/google/home'
    // }, (accessToken, refreshToken, profile, cb) => {
    //     // console.log(profile);
    //     User.findOne({ googleId: profile.id }, (err, user) => {
    //         if (err) {
    //             return done(err);
    //         }
    //         if (!user) {
    //             user = new User({
    //                 name: profile.displayName,
    //                 email: profile.emails[0].value,
    //                 password: 'password',
    //                 googleId: profile.id,
    //                 role: 'bidder'
    //             });
    //             user.save((err) => {
    //                 if (err) console.log(err);
    //                 return cb(err, user);
    //             });
    //         } else {
    //             return cb(err, user);
    //         }
    //     });
    // }
    // ));

    // passport.use(new GoogleStrategy({
    //     clientID: '430628000423-snc4munnnsgs606d70tkgr06mb7p6umn.apps.googleusercontent.com',
    //     clientSecret: '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',
    //     callbackURL: 'http://localhost:3000/auth/google/home'
    // }, (accessToken, refreshToken, profile, cb) => {
    //     // console.log(profile);
    //     User.findOne({ googleId: profile.id }, (err, user) => {
    //         if (err) {
    //             return done(err);
    //         }
    //         if (!user) {
    //             user = new User({
    //                 name: profile.displayName,
    //                 email: profile.emails[0].value,
    //                 password: 'password',
    //                 googleId: profile.id,
    //                 role: 'bidder'
    //             });
    //             user.save((err) => {
    //                 if (err) console.log(err);
    //                 return cb(err, user);
    //             });
    //         } else {
    //             return cb(err, user);
    //         }
    //     });
    // }
    // ));

};