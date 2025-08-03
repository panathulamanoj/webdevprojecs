const express= require('express');
const router=express.Router({mergeParams:true});
const catchasync= require('../utils/Catchasync.js');
const reviews=require('../controllers/reviews.js');
const {isloggedin,validaterev,isReviewAuthor}=require('../middlewares.js');
router.post('/',isloggedin,validaterev,catchasync(reviews.addreview));
router.delete('/:reviewid',isloggedin,isReviewAuthor,catchasync(reviews.deletereview));
module.exports=router;