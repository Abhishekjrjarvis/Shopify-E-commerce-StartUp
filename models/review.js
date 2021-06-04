const mongoose = require('mongoose');
const User = require('./user');
const Product = require('./product');
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
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    reviewCategory: {
        type: String,
        enum: ['Best','Good','Moderate', 'Poor',"Bad"]
    }
});

module.exports = mongoose.model("Review", reviewSchema);