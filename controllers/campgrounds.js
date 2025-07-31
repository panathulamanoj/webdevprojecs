const Campground= require('../models/campground.js');
const {cloudinary} = require('../cloudinary/index.js');
module.exports.index=async(req,res)=>{
const campgrounds= await Campground.find();
res.render('campgrounds/index',{campgrounds});
}

module.exports.loadnewcamppage=(req,res)=>{
res.render('campgrounds/new.ejs');
}

module.exports.getcampground=async(req,res)=>{
const campground= await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
if(!campground)
{
    req.flash('error','cannot find the campground');
    return res.redirect('/campgrounds');
}
res.render('campgrounds/show.ejs',{campground});
}

module.exports.loadcampeditpage=async(req,res)=>{
const campground= await Campground.findById(req.params.id);
res.render('campgrounds/edit.ejs',{campground});
}

module.exports.editcamp=async(req,res)=>{
const campground=await Campground.findByIdAndUpdate(req.params.id,req.body.campground);
if(req.body.deleteimgs && req.body.deleteimgs.length>=1)
{
for(let filename of req.body.deleteimgs)
{
   await cloudinary.uploader.destroy(filename);
}
await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteimgs}}}});
}
const imgs=req.files.map((f)=>{return {url:f.path,filename:f.filename}});
await campground.images.push(...imgs);
await campground.save();
console.log("updating camp")
console.log(req.body.deleteimgs);
req.flash('success','successfully updated the campgrounds');
res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.addnewcamp=async(req,res)=>{
const cmap= new Campground(req.body.campground);
cmap.author=req.user._id;
cmap.images=req.files.map((f)=>{return {url:f.path,filename:f.filename}});
await cmap.save();
req.flash('success','successfully made a new campground!');
res.redirect('/campgrounds');
}

module.exports.deletecamp=async(req,res)=>{
await Campground.findByIdAndDelete(req.params.id);
req.flash('success','successfully deleted review');
res.redirect('/campgrounds');
}