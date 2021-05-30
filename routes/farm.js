const express = require('express');
const Farm = require('../models/farm');
const Product = require('../models/product');
const router = express.Router({mergeParams: true})
const catchAsync = require('../Utilities/catchAsync');
const FarmError = require('../Utilities/FarmError');
const {isLoggedIn, isFarmOwner} = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
// const uploads = multer({ storages })
const { cloudinary } = require('../cloudinary');



router.get("/", catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render("farm/index", { farms });
}));
  
router.get("/new", isLoggedIn,  (req, res) => {
    res.render("farm/new");
});
  
router.post("/", isLoggedIn,  catchAsync(async (req, res) => {
    const farm = await new Farm(req.body);
    // farm.images = await req.files.map(f => ({url: f.path, filename: f.filename}));
    // console.log(farm.images);
    farm.author = req.user._id;
    await farm.save();
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
  
router.delete("/:id", isLoggedIn, isFarmOwner,  catchAsync(async (req, res) => {
    const farms = await Farm.findByIdAndDelete(req.params.id);
    res.redirect("/farms");
}));
  

module.exports = router;