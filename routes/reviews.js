const express= require ('express');
const router= express.Router({mergeParams:true});
const { reviewSchema} = require('../schemas');
const catchAsync = require("../utils/catchAsync");
const ExpressError= require('../utils/ExpressErrors');
const Review=require('../models/reviews');
const Campground = require("../models/campground");
const { request } = require('express');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews= require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
  
  router.delete('/:reviewId', isLoggedIn, isReviewAuthor ,catchAsync(reviews.deleteReview));

  module.exports=router;