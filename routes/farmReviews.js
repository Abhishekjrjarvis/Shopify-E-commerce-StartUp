const express = require('express');
const Product = require('../models/product');
const ReviewFarm = require('../models/reviews')
const Farm = require('../models/farm');
const router = express.Router({mergeParams: true});


router.get('/farm-review', async(req, res) =>{
    const { id } = req.params;
    const farm = await Farm.findById({_id:id}).populate('reviews');
    res.render('farm/farmReview', { farm });
})


router.post('/', async(req, res) =>{
    const{ id } = req.params;
    const farm = await Farm.findById({_id:id})
    const review = await new ReviewFarm(req.body);
    review.author = req.user._id;
    review.farms = farm;
    if(review.rating == 5){
        review.reviewFarmCategory = 'Best'
    }else if(review.rating == 4){
        review.reviewFarmCategory = 'Good'
    }else if(review.rating == 3){
        review.reviewFarmCategory = 'Moderate'
    }else if(review.rating == 2){
        review.reviewFarmCategory = 'Poor'
    }else {
        review.reviewFarmCategory = 'Bad'
    }
    farm.farmReviews.push(review);

    await review.save()
    await farm.save()
    res.redirect(`/farms/${id}/products`)
    
})



// router.delete('/:rid',async(req, res) =>{
//     const { id, rid } = req.params;
//     const product = await Product.findByIdAndUpdate(id, { $pull: { reviews: rid } })
//     const review = await Review.findByIdAndDelete(rid)
//     req.flash('success', 'Successfully Deleted Review')
//     res.redirect(`/products/${id}`);
// })


module.exports = router;
