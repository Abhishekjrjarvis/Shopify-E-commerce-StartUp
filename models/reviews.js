const mongoose = require('mongoose');
const User = require('./user');
const Farm = require('./farm');
const Schema = mongoose.Schema;

const reviewFarmSchema = new Schema({
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
    farms: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    },
    reviewFarmCategory: {
        type: String,
        enum: ['Best','Good','Moderate', 'Poor',"Bad"]
    }
});

module.exports = mongoose.model("ReviewFarm", reviewFarmSchema);