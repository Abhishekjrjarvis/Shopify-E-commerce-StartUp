const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Address = require('../models/address');


router.get('/account/profile/overview/m-address', async(req, res) =>{
    const address = await Address.find({});
    res.render('address', {address});
})
  


router.post('/account/profile/overview/m-address', async(req, res) =>{
    const user = await User.findById({_id: req.user._id});
    const address = await new Address(req.body);
    user.addresses.push(address);
    address.users = req.user._id;
    await user.save();
    await address.save();
    res.redirect('/user/account/profile/overview/address')
})





module.exports = router;