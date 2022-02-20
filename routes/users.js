const express=require('express');
const User=require('../models/user');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const passport=require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
})
router.post('/register', catchAsync(async(req,res,next)=>{
    try{
    const {username,email,password}=req.body;
    const user=new User({email,username});
    const registeredUser= await User.register(user,password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success','Welcome to Yelp Camp');
        res.redirect('/campgrounds');
    });
    
    } catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login');
})
router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome back');
    res.redirect('/campgrounds');
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','successfully logged out');
    res.redirect('/campgrounds');
})

module.exports=router;