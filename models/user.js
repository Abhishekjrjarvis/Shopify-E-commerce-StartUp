const mongoose = require('mongoose');
const Product = require('./product');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
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