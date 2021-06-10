const express = require('express');
const Product = require('../models/product');
const User = require('../models/user');
const router = express.Router({mergeParams: true})
const catchAsync = require('../Utilities/catchAsync');
const FarmError = require('../Utilities/FarmError');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');


// const categories = ["fruit", "electronics", "fashion"];
router.get("/", catchAsync(async(req, res) => {
    const { categories, productReviewRatings, productPriceFilter, productTag } = req.query;
    if (categories) {
      const products = await Product.find({ categories: categories,});
      res.render("index", { products, categories: categories,productPriceFilter: productPriceFilter, productTag: productTag});
    }
    else if(productPriceFilter) {
        if(productPriceFilter === 'under100'){
        const products = await Product.find({$and: [{ price: {$gte: '0'}}, {price: {$lte: '100'}}]});
        res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productPriceFilter === 'under1000'){
            const products = await Product.find({$and: [{ price: {$gte: '101'}}, {price: {$lte: '1000'}}]});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productPriceFilter === 'under10000'){
            const products = await Product.find({$and: [{ price: {$gte: '1001'}}, {price: {$lte: '10000'}}]});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productPriceFilter === 'under100000'){
            const products = await Product.find({$and: [{ price: {$gte: '10001'}}, {price: {$lte: '100000'}}]});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
    }
    else if(productTag){
        if(productTag === 'T-Shirts'){
            const products = await Product.find({tag: 'T-Shirts'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'Jeans'){
            const products = await Product.find({tag: 'Jeans'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'Pants'){
            const products = await Product.find({tag: 'Pants'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'Cotton'){
            const products = await Product.find({tag: 'Cotton'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'Formal'){
            const products = await Product.find({tag: 'Formal'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'Trousers'){
            const products = await Product.find({tag: 'Trousers'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'E-Gadgets'){
            const products = await Product.find({tag: 'E-Gadgets'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'Mob-Acce'){
            const products = await Product.find({tag: 'Mob-Acce'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'Food'){
            const products = await Product.find({tag: 'Food'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'H-Gadgets'){
            const products = await Product.find({tag: 'H-Gadgets'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
        else if(productTag === 'B/Kids'){
            const products = await Product.find({tag: 'B/Kids'});
            res.render("index", { products,categories: categories, productPriceFilter: productPriceFilter , productTag: productTag});
        }
    } 
    else {
      const products = await Product.find({});
      const user = await User.findById({_id: req.user._id}).populate('wishlist')
      res.render("index", { products, categories: "All", productPriceFilter: 'All', productTag: 'All', user });
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
    // const user = await User.findById({_id: req.user._id})
    // const pr = await Product.find({createdAt: {$gte: "2021-06-05T03:45:11.363Z"}})
    // console.log(pr)
    res.render("show", { product, products });

}));



// router.get('/:id/cart', (req, res) =>{
//     res.send('wertyui')
// })


router.post('/:id/cart', isLoggedIn, async(req, res)=>{
    const { id } = req.params;
    const products = await Product.findById({ _id: id });
    const user = await User.findById({_id: req.user._id})
    products.price = products.price;
    products.qty = 1
    await products.save();
    user.cart.push(products);
    await user.save();
    res.redirect('/user/cart');
})


router.delete('/:id/cart', async(req, res) =>{
    const { id }  = req.params;
    const user = await User.findById({_id: req.user._id});
    user.cart.splice(id, 1)
    await user.save()
    res.redirect('/user/cart')
})


router.post('/:id/wishlist', isLoggedIn, async(req, res)=>{
    const { id } = req.params;
    const products = await Product.findById({ _id: id });
    const user = await User.findById({_id: req.user._id})
    user.wishlist.push(products);
    await user.save();
    res.redirect('/user/account/profile/overview/home_wishlist');
})


router.delete('/:id/wishlist', async(req, res) =>{
    const { id }  = req.params;
    const user = await User.findById({_id: req.user._id});
    user.wishlist.splice(id, 1)
    await user.save()
    res.redirect('/user/account/profile/overview/home_wishlist')
})
  
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