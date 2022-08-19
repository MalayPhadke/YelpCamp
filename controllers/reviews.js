const Review = require('../models/reviews');
const Campground = require('../models/campgrounds');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Created Review");
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const {id, review_id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull : {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', "Successfully deleted review");
    res.redirect(`/campground/${id}`)
}