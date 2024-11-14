const express=require("express");


const wrapAsync = require("../utils/wrapAsync");
const passport  = require("passport");

const router=express.Router();
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");


router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));




router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{ //p.authenticate() checks a user is registered one or not if it is,  then it calls 
    failureRedirect:"/login",                        // serializeUser() to store userid in session causing user logged in.
    failureFlash:true,                                  // & then pasport stores user's data in req.
        }),userController.login);




router.get("/logout",userController.logout);

module.exports=router;