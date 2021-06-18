const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Address = require('../models/address');
const Product = require('../models/product');
const Order = require('../models/order');



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


  router.get('/verify-order/confirmation/true', async(req, res) =>{
    const user = await User.findById({_id: req.user._id}).populate({
      path:'orderProducts',
      populate:{
        path:'productsItem'
      }
    })
    const orders = await Order.find(); 
    // console.log(user.orders)
    res.render('order', { user, orders });
  })


  router.get('/verify-order/confirmation/true/:id', async(req, res) =>{
    const { id } = req.params;
    const user = await User.findById({_id: req.user._id})
    const orders = await Order.find(); 
    const order = await Order.findById({_id:id}).populate({
      path:'productsItem'
    }).populate('user'); 
    // console.log(order);
    res.render('orders', { user, order , orders });
  })

router.post('/verify/payment-flow/status-order', async(req, res) =>{
    const user = await User.findById({_id: req.user._id}).populate('cart')
    const order = await new Order(req.body);
    order.user = req.user._id;
    for(let u of user.cart){
      order.productsItem.push(u); 
    }
    await order.save();
    // console.log(order)
    user.orders.push(order);
    user.orderProducts.push(order)
    await user.save();
    res.redirect('/user/verify-order/confirmation/true')
  })
  
  

  




module.exports = router;