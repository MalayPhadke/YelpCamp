# YelpCamp

Created the user, campground and review schema with mongoose and implemented data validation through Joi. <br>
User can login or register to app which is implemented using passport(LocalStrategy).<br>
User can create their own campgrounds or view existing campgrounds. Users can only edit or delete their own campgrounds. They can also post reviews on other campgrounds. User can add photos of their campground which will be stored in cloudinary(using multer middleware).<br>
Use of connect-flash to display flash messages after user performs an action. Use of EJS as templating engine.
Session is implemented to store user data.
Implement various middleware for authorisation and validation of form data.<br>
