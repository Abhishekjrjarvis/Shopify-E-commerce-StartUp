const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

const opts = { toJSON: { virtuals: true } };

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tag: {
        type: String,
        required: true
    },
    saleprice: {
        type: Number,
        min: 0
    },
    price: {
        type: Number,
        min: 0
    },
    description:{
        type: String
    },
    rating: {
        type: Number
    },
    categories: {
        type: String,
        required: true,
        enum: ['Electronics', 'Fashion', 'Grocery', 'Appliances', 'Mobiles', 'Toys']
    },
    qty:{
        type: Number
    },
    images: [ImageSchema],
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
}, opts);

productSchema.post('findOneAndDelete', async function (product) {
    if (product.reviews.length) {
        const check = await Review.deleteMany({ _id: { $in: product.reviews } })
        console.log(product)
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
