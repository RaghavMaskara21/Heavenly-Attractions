const express = require('express');
const path=require('path');
const  mongoose  = require('mongoose');
const Campground= require('../models/campground');
const app=express();
const cities=require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true
});


const db=mongoose.connection;
db.on("error",console.error.bind(console, "connection error"));
db.once("open",()=>{
     console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*30)+10;
        const camp = new Campground({
            author: '62133ad3fe6ef6bcc271215f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)}, ${sample(descriptors)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem aliquid perspiciatis animi voluptatum sed! Itaque, ratione. Tempore laborum similique libero dignissimos unde eveniet soluta repellat magnam, facilis sint possimus ex.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem aliquid perspiciatis animi voluptatum sed! Itaque, ratione. Tempore laborum similique libero dignissimos unde eveniet soluta repellat magnam, facilis sint possimus ex.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/raghavmaskara/image/upload/v1645518580/YelpCamp/j1v2xdgaouwfvmlnumhf.jpg',
                    filename: 'YelpCamp/y1jtlav9chjdb5yvwjht',
                    
                  },
                  {
                    url: 'https://res.cloudinary.com/raghavmaskara/image/upload/v1645519069/YelpCamp/qqfxjj8e9nxjxj60eppz.jpg',
                    filename: 'YelpCamp/qqfxjj8e9nxjxj60eppz',
                   
                  }
              ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})