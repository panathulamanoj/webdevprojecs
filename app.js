if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}
const express=require('express')
const app= express();
const path= require('path');
const session=require('express-session');
const Campground= require('./models/campground.js');
const Review=require('./models/review.js');
const mongoose= require('mongoose');
const Expresserror=require('./utils/Expresserror.js');
const ejsmate= require('ejs-mate');
const {campgroundschema,reviewschema}=require('./schema.js');
const joi= require('joi');
const campgroundroutes=require('./routes/campgroundroutes.js');
const reviewroutes=require('./routes/reviewroutes.js');
const userroutes=require('./routes/userroutes.js')
const methodoverride=require('method-override');
const flash=require('connect-flash');
const passport=require('passport');
const passportlocal=require('passport-local');
const User=require('./models/user.js');
const catchasync = require('./utils/Catchasync.js');
const helmet = require('helmet');
const { contentSecurityPolicy } = require('helmet');
const mongoStore= require('connect-mongo');
const dburl=process.env.db_Url || 'mongodb://localhost:27017/yelp-camp';
const port=process.env.PORT || 3000;
mongoose.connect(dburl);
const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection error:"));
db.once("open",()=>{
    console.log("successfully connected to db");
});
app.listen(port,()=>{
    console.log("listening on port 3000");
});
app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(helmet({contentSecurityPolicy:false}));
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
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
//                 "https://res.cloudinary.com/dns73hsc9/",
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );
const secret=process.env.Secret;
const store= new mongoStore({
    mongoUrl:dburl,
    touchAfter:24*60*60,
    secret
})
const sessionConfig={
    store,
    secret,
    resave:false,saveUninitialized:true,
    name:'session',
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentuser=req.user;
    next();
})

app.get("/loaderio-f8662489f53a862525a2425b2b549172.txt", (req, res) => {
  res.sendFile(path.join(process.cwd(), "loaderio-f8662489f53a862525a2425b2b549172.txt"));
});
app.use('/',userroutes);
app.use('/campgrounds',campgroundroutes);
app.use('/campgrounds/:id/reviews',reviewroutes);
app.get('/',(req,res)=>{
    res.render('home.ejs');
});
app.get('/fakeuser',catchasync(async(req,res)=>{
const user=new User({'email':'manojpana888@gmail.co','username':'manoj888'});
const newuser=await User.register(user,'chicken');
res.send(newuser);
}));
app.all(/(.*)/,(req,res)=>{
    res.send("404 not found beyotch");
});

app.use((err,req,res,next)=>{
    if(err.name!='error')
    {
        err.message=`'${err.name}'`+" "+err.message;
    }

    res.status(err.status=500).render('error.ejs',{err});
});
app.use((req,res)=>{
res.status(404).send("Page not found,cannot find the page you're looking for");
});