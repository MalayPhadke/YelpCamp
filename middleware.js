const Campground = require('./models/campgrounds');
const Review = require('./models/reviews');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./joiSchemas');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        if(!['/login', '/', '/favicon.ico'].includes(req.originalUrl)){
            req.session.returnTo = req.originalUrl;
        }
        req.flash('error', "You must be signed in");
        return res.redirect('/login');
    }
    next();
}

module.exports.validate_data = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const message = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

module.exports.validate_review = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', "You don't have permission for editing this campground!");
        return res.redirect(`/campground/${req.params.id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.review_id);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You are not the author of this review!");
        return res.redirect(`/campground/${req.params.id}`);
    }
    next();
}