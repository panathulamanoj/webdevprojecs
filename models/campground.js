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
const PlayerHistorySchema = new mongoose.Schema({
    wins:{
        type:Number,
        default:0
    },
    loses:{
        type:Number,
        default:0
    },
    matches:[{
        sittingPosition:{
            required:true,
            type:String,
            enum:["south","east","west","north"]
        },
        iswon:{
        type:true,
        require:true
        },
        opponents:[{
        required:true,
        type:Schema.Types.ObjectId
    }]}]
});
const UserChessSchema = new mongoose.Schema({
username:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true
},
profileimage:{
    type:String,
    required:true
},
fullName:{
    type:String,
    required:true
},
emailVisibility:{
    type:Boolean,
    required:true
},
nameVisibility:{
    type:Boolean,
    required:true
},
location:{
    type:String,
    required:true
},
history:{
    type:Schema.Types.ObjectId,
    ref:'PlayerHistorySchema'
}
}) ;