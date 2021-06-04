const express = require('express');
const Product = require('../models/product');
const router = express.Router({mergeParams: true})
const catchAsync = require('../Utilities/catchAsync');
const FarmError = require('../Utilities/FarmError');
const Review = require('../models/review');


// const categories = ["fruit", "electronics", "fashion"];
router.get("/", catchAsync(async(req, res) => {
    const { categories, productReviewRatings, productPriceFilter } = req.query;
    if (categories) {
      const products = await Product.find({ categories: categories,});
      res.render("index", { products, categories: categories,productPriceFilter: productPriceFilter});
    }
    else if(productPriceFilter) {
        if(productPriceFilter === 'under100'){
        const products = await Product.find({$and: [{ price: {$gte: '0'}}, {price: {$lte: '100'}}]});
        res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter});
        }
        else if(productPriceFilter === 'under1000'){
            const products = await Product.find({$and: [{ price: {$gte: '101'}}, {price: {$lte: '1000'}}]});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter});
        }
        else if(productPriceFilter === 'under10000'){
            const products = await Product.find({$and: [{ price: {$gte: '1001'}}, {price: {$lte: '10000'}}]});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter});
        }
        else if(productPriceFilter === 'under100000'){
            const products = await Product.find({$and: [{ price: {$gte: '10001'}}, {price: {$lte: '100000'}}]});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter});
        }
    } else {
      const products = await Product.find({});
      res.render("index", { products, categories: "All", productPriceFilter: 'All'});
    }
}));

  
  
router.get("/new", (req, res) => {
    res.render("new", { categories });
});
  
router.post("/", catchAsync(async (req, res) => {
    const product = await new Product(req.body);
    product.author = req.user._id;
    console.log(product)
    await product.save();
    res.redirect("/products");
}));

  
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).populate({
            path:'reviews',
            populate: {
                path:'author'
            }
        }).populate('author').populate("farm");
        if(!product){
            req.flash('error', 'Can Not find Product')
            res.redirect('/products')
        }
    const products = await Product.find({categories: product.categories});
    res.render("show", { product, products });

}));


  
router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const products = await Product.findById({ _id: id });
    res.render("edit", { products });
}));
  
router.put("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const products = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${products._id}`);
}));
  
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete({ _id: id });
    res.redirect("/products");
}));



module.exports = router;