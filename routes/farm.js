const express = require('express');
const Farm = require('../models/farm');
const Product = require('../models/product');
const Blog = require('../models/blogs');
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







router.get('/blogs', async(req, res)=>{
    const blogs = await Blog.find()
    res.render('blogs', { blogs })
})

router.post('/blogs', async(req, res) =>{
    const blogs = await new Blog(req.body);
    blogs.user = req.user._id;
    await blogs.save();
    res.redirect('/farms/blogs')
})

router.get('/blogs/:id', async(req, res) =>{
    const { id } = req.params;
    const blogs = await Blog.findById({_id:id}).populate('user')
    res.render('blogShow', { blogs })
})

router.delete('/blogs/:id', async(req, res) =>{
    const { id } = req.params;
    // console.log(id)
    const blog = await Blog.findByIdAndDelete({_id:id});
    res.redirect('/farms/blogs')
})



router.get('/guides', async(req, res) =>{
    const blogs = await Blog.find()
    res.render('guides', { blogs })
})




  
router.get("/new", isLoggedIn,  async(req, res) => {
    const user = await User.findById(req.user._id).populate('farms');
    const farm = await Farm.find({})
    res.render("farm/new", { farm , user });
});
  
router.post("/", isLoggedIn, catchAsync(async (req, res) => {
    const farm = await new Farm(req.body);
    const user = await User.findById(req.user._id) 
    farm.author = req.user._id;
    user.farms.push(farm);
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
    }).populate("products").populate('author').populate('farmReviews');
    res.render("farm/show", { farm });
}));


router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id)
    const findFarms = user.farms.indexOf(id);
    user.farms.splice(findFarms, 1)
    user.save();
    const farm = await Farm.findByIdAndDelete({ _id: id });
    res.redirect("/farms");
}));
  
router.get("/:id/products/new", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    res.render("new", { id });
}));
  
router.post("/:id/products", isLoggedIn, upload.array('images'), catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    const product = await new Product(req.body);
    product.qty = 1;
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
    const farm = await Farm.findById(req.params.id).populate({
        path:'farmReviews',
        populate:{
            path: 'author'
        }}).populate('products');
    const user = await User.findById({_id: req.user._id});
    res.render('farm/store', { farm, user })

})
  
router.delete("/:id/products/:pid", isLoggedIn, isFarmOwner,  catchAsync(async (req, res) => {
    const { id, pid } = req.params;
    const farms = await Farm.findByIdAndUpdate(id, { $pull: { products: pid } });
    const product = await Product.findByIdAndDelete(pid);
    console.log(farms);
    res.redirect("/farms");
}));
  



module.exports = router;