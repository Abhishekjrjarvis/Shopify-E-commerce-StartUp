const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const async = require('async');
const nodemailer = require('nodemailer')
const crypto = require('crypto');



router.get('/register', (req, res) =>{
    res.render('user/register')
})


router.post('/register', async(req, res, next) =>{
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            // console.log(registeredUser);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'yeah Farm...');
                res.redirect('/farms');
            })
        }catch (e) {
            req.flash('error', e.message);
            res.redirect('register');
        }
})


router.get('/login', (req, res)=>{
    res.render('user/login');
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }) , async(req, res, next) =>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/farms';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success', 'successfully logout')
    res.redirect('/products');
})


router.get('/forgot', function(req, res) {
    res.render('forgot');
  });
  
router.post('/forgot', function(req, res, next) {
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
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/user/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'yelpcamp44@gmail.com',
            pass: process.env.GMAIL_PASSWORD
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'yelpcamp44@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/user/forgot');
    });
});
  
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/user/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'yelpcamp44@gmail.com',
            pass: process.env.GMAIL_PASSWORD
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'yelpcamp44@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/farms');
    });
  });
  



module.exports = router;
