const mongoose = require ('mongoose');
const reviews = require('./reviews');
const Schema = mongoose.Schema;

const ImageSchema=new Schema({
    url: String,
            filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});
ImageSchema.virtual('cardImage').get(function() { 
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop');
});

const CampgroundSchema = new Schema ({
    title: String,
    images: [ImageSchema],
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