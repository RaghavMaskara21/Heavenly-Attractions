const mongoose = require ('mongoose');
const reviews = require('./reviews');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema ({
    title: String,
    images: [
        {
            url: String,
            fileName: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete',async function(doc)  {
    if(doc){
        await reviews.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);