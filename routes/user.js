const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Farm = require('../models/farm');
const Product = require('../models/product');
const passport = require('passport');
const bcrypt = require('bcrypt');
const async = require('async');
const nodemailer = require('nodemailer')
const crypto = require('crypto');
// const multer = require('multer');
// const { storages } = require('../cloudinary/farmIndex');
// const uploads = multer({ storages })
// const { cloudinary } = require('../cloudinary');




router.get('/register', (req, res) =>{
    res.render('user/register')
})


router.post('/register', async(req, res, next) =>{
        try {
            const { email, username, password, firstname, lastname, mobno} = req.body;
            const user = new User({ email, username, firstname, lastname, mobno });
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
    req.flash('success', `welcome back! ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/farms';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success', 'successfully logout')
    res.redirect('/farms');
})


router.get('/account/profile/overview', async(req, res) =>{
  const user = await User.find({});
  res.render('profile', {user});
})

router.get('/account/profile/overview/m-account', async(req, res) =>{
  const user = await User.find({});
  const farm = await Farm.find({});
  res.render('account', {user, farm });
})



router.get('/account/profile/overview/address', async(req, res) =>{
  const user = await User.findById({_id: req.user._id}).populate('addresses');
  // console.log(user);
  res.render('addshow', { user });
})

router.delete('/account/profile/overview/address/:id', async(req, res) =>{
  const { id }  = req.params;
  const user = await User.findById({_id: req.user._id});
  user.addresses.splice(id, 1)
  await user.save();
  res.redirect('/user/account/profile/overview/address')
})



router.get('/cart', async(req,res) =>{
  const user = await User.findById({_id: req.user._id}).populate('cart').populate('addresses');
  res.render('cart', { user })
})

router.get('/account/profile/overview/home_wishlist', async(req, res) =>{
  const user = await User.findById({_id: req.user._id}).populate('wishlist').populate('addresses');
  res.render('wishlist', { user });
})


router.post('/account/:id/p-qty', async(req, res) =>{
  const { id } = req.params;
  const products = await Product.findById({ _id: id });
  const user = await User.findById({_id: req.user._id}).populate('cart')
  products.qty = products.qty + 1;
  for(let f of user.cart){
    f.qty = products.qty 
  }
  await products.save()
  await user.save()
  console.log(user) 
  res.redirect('/user/cart')
})

router.delete('/account/:id/p-qty', async(req, res) =>{
  const { id }  = req.params;
  const products = await Product.findById({ _id: id });
  const user = await User.findById({_id: req.user._id});
  products.qty = products.qty - 1;
  for(let f of user.cart){
    f.qty = products.qty 
  }
  await products.save()
  await user.save()
  res.redirect('/user/cart')
})


router.get('/verify-acc-cart/checkout',async(req, res)=>{
  const user = await User.findById({_id: req.user._id}).populate('cart').populate('addresses');
  res.render('payment', { user })
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
          from: 'Shopify',
          subject: 'Shopify Reset Password ',
          text: 'Hello,\n\n' +
            'We have recieved a request to reset the password for the Shopify account associated with the ' + user.email + ' No changes have been made to your account yet. \n\n'+ 
            '\n'+   
            'You can reset the password by clicking the link below: \n\n' +
            'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
            '\n\n'+
            'If you did not request this, please ignore this email and your password will remain unchanged.\n\n'+
            '\n\n'+
            '- The Shopify Team',
          // html: "<p><h3>Hello,</h3></p><p> Embedded image: <img src='https://img.icons8.com/ios-filled/50/fa314a/shopify.png'/></p>",
          
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' see for further instructions.');
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
        req.flash('error', 'Sorry, this change password link is not valid. Please request another one.');
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
            req.flash('error', 'Sorry, this change password link is not valid. Please request another one.');
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
              req.flash("error", "Passwords does not match.");
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
          from: 'Shopify',
          subject: 'Your Password has been Changed Successfully',
          text: 'Hello,\n\n' +
            '\n' + 
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n' + 
            '\n' + 
            '- The Shopify Team'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/farms');
    });
  });
  



module.exports = router;
