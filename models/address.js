const mongoose = require('mongoose');
const User = require('./user');

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobno: {
        type: Number,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Address', addressSchema);