const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelper');
mongoose.connect('mongodb://localhost:27017/yelp', {
    useNewUrlParser: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error!"));
db.once('open', () => {
    console.log("Database connected!");
});

const sample = (arr) => arr[Math.floor(Math.random()*arr.length)];

const seedDb = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random_index = Math.floor(Math.random()*400);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '62b71c715d7a0f2fdcb81b81',
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dwyrjbinw/image/upload/v1656440566/YelpCamp/ekxyq7kxkikkpbfsevye.jpg',
                  fileName: 'YelpCamp/ekxyq7kxkikkpbfsevye.jpg'
                },
                {
                  url: 'https://res.cloudinary.com/dwyrjbinw/image/upload/v1656440027/YelpCamp/p3adzit8pvax8mmpyt7q.jpg',
                  fileName: 'YelpCamp/p3adzit8pvax8mmpyt7q'
                },
                {
                  url: 'https://res.cloudinary.com/dwyrjbinw/image/upload/v1656440027/YelpCamp/aoxvvghpsod7nrj62or0.jpg',
                  fileName: 'YelpCamp/aoxvvghpsod7nrj62or0'
                }
            ],
            location: `${cities[random_index].city}, ${cities[random_index].admin_name}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum dolorem esse eligendi tempora quos totam, provident rem saepe magnam adipisci commodi impedit sit voluptatibus quam a et molestiae iure modi!',
            price
        });
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})