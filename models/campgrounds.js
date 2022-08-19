const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const campgroundSchema =  new Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    images: [
        {
           url: String,
           fileName: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

campgroundSchema.post('findOneAndDelete', async function(data) {
    // console.log("deleted");
    if(data) {
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);