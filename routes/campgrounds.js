const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgrounds');
const {isLoggedIn, validate_data, isAuthor} = require('../middleware');
const campground = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(campground.index));

router.route('/new')
    .get(isLoggedIn, campground.newCampground)
    .post(isLoggedIn, upload.array("image"), validate_data,  catchAsync(campground.createCampground));

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, validate_data, catchAsync(campground.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.showEdit));

router.route('/:id/images')
    .get(isLoggedIn, isAuthor, catchAsync(campground.showImageForm))
    .put(isLoggedIn, isAuthor, upload.array("image"), catchAsync(campground.addImage));

module.exports = router;