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
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)}, ${sample(descriptors)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem aliquid perspiciatis animi voluptatum sed! Itaque, ratione. Tempore laborum similique libero dignissimos unde eveniet soluta repellat magnam, facilis sint possimus ex.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem aliquid perspiciatis animi voluptatum sed! Itaque, ratione. Tempore laborum similique libero dignissimos unde eveniet soluta repellat magnam, facilis sint possimus ex.',
            price
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})