if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require('./utils/ExpressErrors');
const app = express();
const campgroundRoutes=require ('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy= require('passport-local');
const User=require('./models/user');
const mongoSanitize= require('express-mongo-sanitize');
const dbUrl= process.env.DB_URL;
const MongoStore = require('connect-mongo');
//const helmet=require('helmet');


//"mongodb://localhost:27017/yelp-camp"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});




// app.use(
//   helmet({
//     referrerPolicy: { policy: "no-referrer" },
//     contentSecurityPolicy: false,
//   })
// );


//app.use(helmet());


// const scriptSrcUrls = [
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://api.mapbox.com/",
//   "https://kit.fontawesome.com/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net",
// ];
// //This is the array that needs added to
// const styleSrcUrls = [
//   "https://kit-free.fontawesome.com/",
//   "https://api.mapbox.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://fonts.googleapis.com/",
//   "https://use.fontawesome.com/",
//   "https://cdn.jsdelivr.net",
// ];
// const connectSrcUrls = [
//   "https://api.mapbox.com/",
//   "https://a.tiles.mapbox.com/",
//   "https://b.tiles.mapbox.com/",
//   "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/raghavmaskara", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true })); //parsing request body
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'useabettersecret'
  }
});



const sessionConfig= {
  store,
  name:'session22',
  secret: 'useabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly:true,
    //secure:true,
    expires: Date.now()+ 1000*60*60*24*7,
    maxAge:  1000*60*60*24*7
  }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  
  res.locals.currentUser=req.user;
  res.locals.success= req.flash('success');
  res.locals.error=req.flash('error');
  next();
})

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});





app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong!!!';
    res.status(statusCode).render('error',{err});
    
});

app.listen("3000", () => {
  console.log("Listening port 3000");
});
