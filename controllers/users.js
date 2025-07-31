const User =require('../models/user.js');
module.exports.loadregisterpage=(req,res)=>{
    res.render('users/register.ejs');
}

module.exports.registeruser=async(req,res)=>{
    const {username,password,email}=req.body;
const user=new User({username,email});
const registereduser=await User.register(user,password);
req.flash("success","welcome to yelpcamp!");
res.redirect('/campgrounds');
};

module.exports.loadloginpage=(req,res)=>{
    res.render('users/login.ejs');
}

module.exports.loginuser=(req,res)=>{
const redirecturl=res.locals.returnTo || '/campgrounds';    
req.flash('success','Welcome Back!');
res.redirect(redirecturl);
}

module.exports.logoutuser=(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash('success','logout success GoodBye');
        res.redirect('/campgrounds');
    })
}
