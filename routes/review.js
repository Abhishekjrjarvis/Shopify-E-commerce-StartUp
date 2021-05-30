const express = require('express');
const Product = require('../models/product')
const Review = require('../models/review')
const router = express.Router({mergeParams: true});

router.post('/', async(req, res) =>{
    const{ id } = req.params;
    const product = await Product.findById({_id:id})
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    product.reviews.push(review);
    await review.save()
    await product.save()
    res.redirect(`/products/${id}`)
    
})

router.delete('/:rid',async(req, res) =>{
    const { id, rid } = req.params;
    const product = await Product.findByIdAndUpdate(id, { $pull: { reviews: rid } })
    const review = await Review.findByIdAndDelete(rid)
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/products/${id}`);
})


module.exports = router;