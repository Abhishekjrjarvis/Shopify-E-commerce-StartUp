const mongoose = require('mongoose');
const User = require('./user');
const Product = require('./product');

const orderSchema = new mongoose.Schema({
    productsItem:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    useraddress:{
        type: String,
        required: true
    },
    orderedDate: {
        type: Date,
        default: Date.now
    },
    cancelDate:{
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;