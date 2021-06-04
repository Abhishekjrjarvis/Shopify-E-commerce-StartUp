const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
})

const storages = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'Store',
        allowedFormats: ['jpeg, png, jpg']
    }
})

module.exports = {
    cloudinary,
    storages
}


// Yelpcamp10@#
