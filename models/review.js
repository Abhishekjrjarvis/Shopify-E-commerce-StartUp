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
    reviewCategory: {
        type: String,
        enum: ['Best','Good','Moderate', 'Poor',"Bad"]
    }
});

module.exports = mongoose.model("Review", reviewSchema);