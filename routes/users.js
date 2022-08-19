const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/users');
const {isLoggedIn} = require('../middleware');

router.route('/register')
    .get(user.showRegister)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.showLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),  user.loginUser);

router.get('/logout', user.logoutUser);

router.get('/profile', isLoggedIn, catchAsync(user.profile));

module.exports = router;