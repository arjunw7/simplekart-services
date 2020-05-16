let mongoose = require('mongoose');

let LocalStrategy   = require('passport-local').Strategy;
module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user.username);
            done(err, user);
        });
    });

};