const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'Product_Images',
        allowedFormats: ['jpeg, png, jpg']
    }
})
// const storages = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params:{
//         folder: 'Store_Images',
//         allowedFormats: ['jpeg, png, jpg']
//     }
// })

module.exports = {
    cloudinary,
    storage,
    // storages
}

