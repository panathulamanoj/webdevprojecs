const Review=require('../models/review.js');
const Campground=require('../models/campground.js');
module.exports.addreview=async(req,res)=>{
 const campground=await Campground.findById(req.params.id);
 const review=new Review(req.body.review);
  review.author=req.user._id;
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash('success','created new review');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deletereview=async(req,res)=>{
const {id,reviewid}=req.params;
await Campground.findByIdAndUpdate(id,{$pull:{'reviews':reviewid}});
await Review.findByIdAndDelete(reviewid);
req.flash('success','successfully deleted  review');
res.redirect(`/campgrounds/${id}`);
}
