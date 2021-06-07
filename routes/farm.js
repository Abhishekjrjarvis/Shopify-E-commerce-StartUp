const express = require('express');
const Farm = require('../models/farm');
const Product = require('../models/product');
const User = require('../models/user');
const router = express.Router({mergeParams: true})
const catchAsync = require('../Utilities/catchAsync');
const FarmError = require('../Utilities/FarmError');
const {isLoggedIn, isFarmOwner} = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage })
const { cloudinary } = require('../cloudinary');



router.get("/", catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render("farm/index", { farms });
}));
// let h = ''
//  const hello = async() =>{
//     const farmss = await Farm.find({name: 'banana'})
//     for(let p of farmss){
//         h = `${p.name}`
//         console.log(h)  
//     }
//  }
// hello()
// router.get('/b', (req, res) =>{
//     res.send(`${req.headers.host}/store/${h}`)
// })
  
router.get("/new", isLoggedIn,  async(req, res) => {
    const user = await User.findById(req.user._id);
    const farm = await Farm.find({name: user.storename})
    res.render("farm/new", { farm , user });
});
  
router.post("/", isLoggedIn, catchAsync(async (req, res) => {
    const farm = await new Farm(req.body); 
    const user = await User.findById(req.user._id);
    // farm.images = await req.files.map(f => ({url: f.path, filename: f.filename}));
    // console.log(farm.images);
    farm.author = req.user._id;
    user.storename = farm.name; 
    await farm.save();
    await user.save();
    res.redirect("/farms");
}));
  
router.get("/:id", catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate("products").populate('author');
    res.render("farm/show", { farm });
}));
  
router.get("/:id/products/new", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    res.render("new", { id });
}));
  
router.post("/:id/products", isLoggedIn, upload.array('images'), catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    const product = await new Product(req.body);
    product.author = req.user._id;
    product.images = await req.files.map(f => ({url: f.path, filename: f.filename})); 
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect("/farms");
}));


router.get('/:id/products', async(req, res) =>{
    const { id } = req.params;
    const farm = await Farm.findById(req.params.id).populate('products');
    res.render('farm/store', { farm })

})
  
router.delete("/:id", isLoggedIn, isFarmOwner,  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farms = await Farm.findByIdAndDelete({_id:id});
    console.log(farms)
    res.redirect("/farms");
}));
  

module.exports = router;