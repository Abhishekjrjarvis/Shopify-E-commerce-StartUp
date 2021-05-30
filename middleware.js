// const { farmSchema, reviewSchema } = require('./schema.js');
const FarmError = require('./Utilities/FarmError');
const Farm = require('./models/farm');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Login Required');
        return res.redirect('/user/login');
    }
    next();
}

// module.exports.validateFarm = (req, res, next) => {
//     const { error } = farmSchema.validate(req.body);
//     console.log(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new FarmError(msg, 400)
//     } else {
//         next();
//     }
// }

module.exports.isFarmOwner = async (req, res, next) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/farms/${id}`);
    }
    next();
}

// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, rid } = req.params;
//     const review = await Review.findById(rid);
//     if (!review.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// module.exports.validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new YelpCampError(msg, 400)
//     } else {
//         next();
//     }
// }