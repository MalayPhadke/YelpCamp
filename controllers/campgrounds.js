const Campground = require('../models/campgrounds');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', {campgrounds});
}

module.exports.newCampground = (req, res) => {
    res.render('campground/new');
}

module.exports.createCampground = async (req, res, next) => {
    const new_campground = new Campground(req.body.campground);
    new_campground.images =  req.files.map(file => ({url: file.path, fileName: file.filename}))
    new_campground.author = req.user._id;
    await new_campground.save();
    console.log(new_campground);
    req.flash('success', `Successfully added the new campground ${new_campground.title}`)
    res.redirect(`/campground/${new_campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campground');
    }
    res.render('campground/show', {campground})
}

module.exports.showEdit = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campground');
    }
    res.render('campground/edit', {campground});
}

module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash('success', `Successfully updated campground ${campground.title}`)
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    const del_camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campground');
}

module.exports.showImageForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campground');
    }
    res.render('campground/imageForm', {campground});
}

module.exports.addImage = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(req.files){
        const imgs = req.files.map(file => ({url: file.path, fileName: file.filename}));
        campground.images.push(...imgs);
        console.log(campground);
        await campground.save();
        req.flash('success', "Successfully added images");
    }
    if(req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImages } } } });
        req.flash('success', "Successfully deleted images");
        console.log("After deletion");
    }
    res.redirect(`/campground/${req.params.id}`);
}