const express = require('express');
const Product = require('../models/product');
const Review = require('../models/review')
const router = express.Router({mergeParams: true});


router.get('/write-review', async(req, res) =>{
    const { id } = req.params;
    const product = await Product.findById({_id:id}).populate('reviews');
    res.render('reviews', { product });
})


router.post('/', async(req, res) =>{
    const{ id } = req.params;
    const product = await Product.findById({_id:id})
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    review.products = product;
    if(review.rating == 5){
        review.reviewCategory = 'Best'
    }else if(review.rating == 4){
        review.reviewCategory = 'Good'
    }else if(review.rating == 3){
        review.reviewCategory = 'Moderate'
    }else if(review.rating == 2){
        review.reviewCategory = 'Poor'
    }else {
        review.reviewCategory = 'Bad'
    }
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
