const mongoose = require('mongoose');
const Product = require('./product');
const Address = require('./address');
const Farm = require('./farm');
const Order = require('./order');
const passportLocalMongoose = require('passport-local-mongoose');



const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    mobno: {
        type: Number,
        required: true
    },
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address'
        }
    ],
    orderProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'   
        }
    ],
    email: {
        type: String,
        unique: true,
        required: [true,'You must have a valid Email']
    },
    farms:[
        {
            type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cart:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        
    ],
    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        }
    ],
    orders:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'   
        }
        
    ]

})


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema)