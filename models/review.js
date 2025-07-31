const mongoose=require('mongoose');
const User = require('./user.js');
const reviewschema=mongoose.Schema({
    body:String,
    rating:Number,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});
module.exports=mongoose.model('Review',reviewschema);