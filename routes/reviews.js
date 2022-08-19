const express = require('express');
const router = express.Router({mergeParams: true});
const flash = require('connect-flash')
const catchAsync = require('../utils/catchAsync');
const {validate_review, isLoggedIn, isReviewAuthor} = require('../middleware');
const Review = require('../models/reviews');
const Campground = require('../models/campgrounds');
const review = require('../controllers/reviews');

router.post('/', isLoggedIn, validate_review, catchAsync(review.createReview));

router.delete('/:review_id', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;