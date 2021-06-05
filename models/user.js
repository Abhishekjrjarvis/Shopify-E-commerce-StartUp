const mongoose = require('mongoose');
const Product = require('./product');
const Address = require('./address');
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
    email: {
        type: String,
        unique: true,
        required: [true,'You must have a valid Email']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

})


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema)