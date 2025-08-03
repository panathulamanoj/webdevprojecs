const express=require('express');
const router=express.Router({mergeParams:true});
const passport = require('passport');
const {isloggedin,storeurl}=require('../middlewares.js');
const users= require('../controllers/users.js');
router.route('/register')
      .get(users.loadregisterpage)
      .post(users.registeruser);
router.route('/login')
      .get(users.loadloginpage)
      .post(storeurl,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginuser);
router.get('/logout',users.logoutuser);
module.exports=router;