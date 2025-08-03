const {campgroundschema}= require('./schema.js');
const Campground=require('./models/campground.js');
const Review= require('./models/review.js');
const {reviewschema} = require('./schema.js');
const Expresserror= require('./utils/Expresserror.js');
const catchasync=require('./utils/Catchasync.js');
module.exports.isloggedin=function(req,res,next){
if(req.isAuthenticated())
{
    // console.log(req.user);
    return next();
}
req.session.returnTo=req.originalUrl;
res.redirect('/login');
};
module.exports.validateschema=function(req,res,next)
{
    const result=campgroundschema.validate(req.body);
    if(result.error)
    {
        console.log(result);
        const message=result.error.details.map((e)=>e.message).join(',');
        console.log(message)
       return throw new Expresserror(message,500);
    }
    else
    {
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
    const {id}= req.params;
    const campground=await  Campground.findById(id);
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error','You dont have permission to do that!');
       return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewid}= req.params;
    const review=await  Review.findById(reviewid);
    if(!review.author.equals(req.user._id))
    {
        req.flash('error','You dont have permission to do that!');
       return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}
module.exports.validaterev=function validaterev(req,res,next)
{
    const result=reviewschema.validate(req.body);
      if(result.error)
    {
        console.log(result);
        const message=result.error.details.map((e)=>e.message).join(',');
        console.log(message)
       return throw new Expresserror(message,500);
    }
    else
    {
        next();
    }
}
module.exports.storeurl=function(req,res,next){
    if(req.session.returnTo)
    {
        res.locals.returnTo=req.session.returnTo;
    }
    return next();
} 
