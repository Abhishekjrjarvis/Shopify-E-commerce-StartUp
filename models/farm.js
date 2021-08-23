const mongoose = require('mongoose');
const Product = require('./product')
const ReviewFarm = require('./reviews');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

const opts = {toJSON: {virtuals: true}}

const farmSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name must be Valid']
    },
    qty: {
        type: Number,
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Fashion', 'Grocery', 'Appliances', 'Mobiles', 'Toys','Home Furniture']
    },
    city: {
        type: String,
        required: [true, 'Farm Must be Valid']
    },
    description: {
        type: String
    },
    images: [ImageSchema],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    farmReviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReviewFarm'
        }
    ]
}, opts);

// farmSchema.pre('findOneAndDelete', async function (data) {
//     console.log('pre middleware .........')
//     console.log(data)
// })

farmSchema.post('findOneAndDelete', async function (farm) {
    if (farm.products.length) {
        const check = await Product.deleteMany({ _id: { $in: farm.products } })
        console.log(farm)
    }
})

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;
