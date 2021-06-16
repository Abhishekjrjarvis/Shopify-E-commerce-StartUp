const mongoose = require('mongoose');
const User = require('./user');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    body: {
        type: String,
        required: true
    },
    blogTag: {
        type: String,
        required: true,
        enum: ['Brand', 'Find An Idea', 'Guides', 'Business Intelligence', 'Backoffice', 'Podcasts']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})


const Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;