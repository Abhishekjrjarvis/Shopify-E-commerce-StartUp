const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // ratings:{
    //     type: Number,
    //     enum: ['5,4,3,2,1']
    // }
});

module.exports = mongoose.model("Review", reviewSchema);