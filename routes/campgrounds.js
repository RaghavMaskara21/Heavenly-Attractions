const express= require ('express');
const router= express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError= require('../utils/ExpressErrors');
const Campground = require("../models/campground");
const {CampgroundSchema, reviewSchema} = require('../schemas');

const validateCampground = (req,res,next)=>{
    
    const {error} = CampgroundSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.get(
    "/",
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render("campgrounds/index", { campgrounds });
    })
  );
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.post(
    "/",
    validateCampground, catchAsync(async (req, res, next) => {
        
        
      const campground = new Campground(req.body.campground);
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  


  router.get(
    "/:id",
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id).populate('reviews');
      res.render("campgrounds/show", { campground });
    })
  );
  
  router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      res.render("campgrounds/edit", { campground });
    })
  );
  
  router.put(
    "/:id",
    validateCampground,catchAsync(async (req, res) => {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
      });
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.delete(
    "/:id",
    catchAsync(async (req, res) => {
      const { id } = req.params;
      await Campground.findByIdAndRemove(id);
      res.redirect(`/campgrounds`);
    })
  );

  module.exports=router;