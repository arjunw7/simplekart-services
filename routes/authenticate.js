var mongoose = require('mongoose');
var User = mongoose.model('User');
var express = require('express');
var async = require('async');
var crypto = require('crypto');
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var msg91 = require("msg91")("116142AQGxO25kEXN57658c70", "SASITR", 4 );
var router = express.Router();

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};
// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = function(passport){

    // //log in
    router.post('/login', function (req,res) {
        // check in mongo if a user with username exists or not
        User.findOne({ 'email' :  req.body.username },
            function(err, user) {
                // In case of any error, return using the done method
                if (err) {
                    res.send({status: 'failure', user: null, isAuthenticated: false, error: err});
                }
                // Username does not exist, log the error and redirect back
                else if (!user){
                    console.log('User Not Found with username '+ req.body.username);
                    res.send({status: 'failure', user:null, isAuthenticated: false, error:"You have entered an invalid email."});
                }
                // User exists but wrong password, log the error
                else if (!isValidPassword(user, req.body.password)){
                    console.log(user)
                    console.log('Invalid Password');
                    res.send({status: 'failure', user:null, isAuthenticated: false, error:"You have entered incorrect password."});
                }
                else{
                    res.send({status: 'success', user:user, isAuthenticated:  true, error:null});
                }
            }
        );
    });

    //sign up
    router.post('/signup', function (req,res) {
        // find a user in mongo with provided username
        User.findOne({ 'username' :  req.body.username }, function(err, user) {
            // In case of any error, return using the done method
            if (err){
                console.log('Error in SignUp: '+err);
                res.send({status: 'failure', user:null, isAuthenticated: false, error:err});
            }
            // already exists
            if (user) {
                console.log('User already exists with username: '+ req.body.username);
                res.send({status: 'failure', user:null, isAuthenticated: false, error:"The email address you are using is already in use."});
            } else {
                // if there is no user, create the user
                let newUser = new User();

                // set the user's local credentials
                newUser.name = req.body.name;
                newUser.email = req.body.email;
                newUser.contact = req.body.contact;
                newUser.username = req.body.username;
                newUser.password = createHash(req.body.password);
                newUser.tinNumber = req.body.tinNumber;
                newUser.gstFileUrl = req.body.gstFileUrl;
                newUser.gstFileStatus = req.body.gstFileStatus;
                newUser.isActive = req.body.isActive;
                newUser.eligibleToSell = req.body.eligibleToSell;
                newUser.status = req.body.status;
                newUser.role = req.body.role;
                // save the user
                newUser.save(function(err, user) {
                    if (err){
                        console.log('Error in Saving user: '+err);
                        res.send({status: 'failure', user:null, isAuthenticated: false, error:"Unknown error occured while signing up. Please try again."});
                    }
                    console.log(user + ' Registration succesful');
                    res.send({status: 'success', user:user, isAuthenticated: true, error:null});
                });
            }
        });
    });

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // //route to retain user details on client side
    // router.get('/confirmLogin', function(req, res) {
    //     if(req.user){
    //         res.send(req.user)
    //     }
    //     else{
    //         res.send(req.isAuthenticated() ? req.user : '0');
    //     }
    // });

    // route to test if the user is logged in or not
    router.get('/isAuthenticated', function(req, res) {
        res.send({user: req.isAuthenticated() ? req.user : null, isAuthenticated: req.isAuthenticated() ? true : false});
    });

    router.route('/forgot')
        .post(function(req, res, next) {
            async.waterfall([
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    User.findOne({ email: req.body.email }, function(err, user) {
                        if (!user) {
                            return res.redirect('/forgotPassword');
                        }

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function(err) {
                            done(err, token, user);
                        });
                    });
                },
                function(token, user, done) {
                    var transporter = nodemailer.createTransport('smtps://arjunw7@gmail.com:9943130589@smtp.gmail.com');
                    var mailOptions = {
                        to: user.email,
                        from: 'Sasi Travels',
                        subject: 'Password change request',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' + req.headers.host + '#/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    transporter.sendMail(mailOptions, function(err) {
                        done(err, 'done');
                        console.log("Mail sent")
                    });
                }
            ], function(err) {
                if (err) return next(err);
            });
        });

    router.route('/reset/:token')
        .get(function(req, res) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    console.log('Password reset token is invalid or has expired.');
                    return res.redirect('/forgot');
                }
                res.redirect('/reset')
            });
        })

        .post(function(req, res) {
            async.waterfall([
                function(done) {
                    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                        if (!user) {
                            console.log('Password reset token is invalid or has expired.');
                            return res.redirect('back');
                        }
                        console.log(user.username);
                        user.password = createHash(req.body.password);
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                },
                function(user, done) {
                    var transporter = nodemailer.createTransport('smtps://arjunw7@gmail.com:9943130589@smtp.gmail.com');
                    var mailOptions = {
                        to: user.email,
                        from: 'Food Mall VITU',
                        subject: 'Password reset successful',
                        text: 'Hello,\n\n' +
                            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                    };
                    transporter.sendMail(mailOptions, function(err) {
                        console.log('Success! Your password has been changed.');
                        done(err);
                    });
                    var mobileNo = user.contact;
                    msg91.send(mobileNo, "Dear Customer, your Sasi Travels password has been changed successfully.", function(err, response){
                        console.log(err);
                        console.log(response);
                    });
                }
            ], function(err) {
                res.redirect('/');
            });
        });

    return router;
}