const mongoose = require('mongoose');
const Review =require('./review.js');
const User = require('./user.js');
const schema=mongoose.Schema;
const imageschema=new schema({
    url:String,
    filename:String
});
imageschema.virtual('thumbnail').get(function(){
return this.url.replace('/upload','/upload/w_400');
});
const campgroundschema=new schema({
    title:String,
    description:String,
    images:[imageschema],
    price:Number,
    location:String,
    author:{type:schema.Types.ObjectId,ref:'User'},
    reviews:[{type:mongoose.Schema.Types.ObjectId,ref:'Review'}]
});
campgroundschema.post('findOneAndDelete',async(data)=>{
    for(let id of data.reviews)
    {
        await Review.findByIdAndDelete(id);
    }
});
module.exports=new mongoose.model('Campground',campgroundschema);
