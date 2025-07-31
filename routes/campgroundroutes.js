const express= require('express');
const router = express.Router();
const catchasync= require('../utils/Catchasync.js');
const {campgroundschema}=require('../schema.js');
const {isloggedin,validateschema,isAuthor}=require('../middleware.js');
const campgrounds= require('../controllers/campgrounds.js');
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
const upload = multer({storage});
router.route('/')
      .get(catchasync(campgrounds.index))
      .post(isloggedin,upload.array('images'),validateschema,catchasync(campgrounds.addnewcamp));
      // .post(upload.array('files'),(req,res)=>{
      // console.log(req.body,req.files);
      // res.send('it worked');
      // });
router.get('/new',isloggedin,campgrounds.loadnewcamppage);
router.route('/:id')
        .get(catchasync(campgrounds.getcampground))
        .patch(isloggedin,isAuthor,upload.array('images'),validateschema,catchasync(campgrounds.editcamp))
        .delete(isloggedin,isAuthor,catchasync(campgrounds.deletecamp));
router.get('/:id/edit',isloggedin,isAuthor,catchasync(campgrounds.loadcampeditpage));
module.exports=router;