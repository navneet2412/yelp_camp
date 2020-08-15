
var express= require("express");
var app=express();
 var flash = require("connect-flash");
var bodyParser  = require("body-parser");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
//var seedDB      = require("./seeds");
var User = require("./models/user");
app.locals.moment = require('moment');
var  passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride= require("method-override");


  

 const mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost:27017/yelp_datadbfinal1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB();

    
//requring routes
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes      = require("./routes/index");
  

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mind it-Important logic.
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000,function(){
    console.log("The Yelpcamp server has started");
});