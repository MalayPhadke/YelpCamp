const User = require('../models/users');
const Campground = require('../models/campgrounds');

module.exports.showRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {return next(err)};
            req.flash("success", "Welcome to Yelp Camp");
            res.redirect('/campground');
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.showLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', "Welcome Back!");
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);    
}

module.exports.logoutUser = (req, res) => {
    req.logout(err => {
        if(err) {return err};
        req.flash('success', "Goodbye!");
        res.redirect('/campground');
    });
}

module.exports.profile = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const ownedCamps = await Campground.find({author: userId});
    res.render('users/profile', {ownedCamps, user});
}