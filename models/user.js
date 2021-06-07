const mongoose = require('mongoose');
const Product = require('./product');
const Address = require('./address');
const passportLocalMongoose = require('passport-local-mongoose');

// const avatarSchema = new mongoose.Schema({
//     url: String,
//     filename: String
// })

// const opts = {toJSON: {virtuals: true}}


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
    storename: {
        type: String,
        unique: true
    },
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address'
        }
    ],
    email: {
        type: String,
        unique: true,
        required: [true,'You must have a valid Email']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cart:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]

})


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema)