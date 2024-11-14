
const User = require("../models/user");
let renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}



let signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newuser=new User({
            email,
            username,
        });
       const registereduser= await User.register(newuser,password);

    req.login(registereduser,(err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success",`Hi ${username}! Welcome to Wanderlust!`);
           
            res.redirect("/listings");

            
        }
    });

    }catch(err){
        req.flash("error",  err.message);
        
        res.redirect("/signup");
    }

};


let renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};


let login=(req,res)=>{
    req.flash("success",`Hello ${req.body.username} ! Welcome back to Wanderlust`);
 
    let redirectUrl=res.locals.redirectUrl|| "/listings";
       res.redirect(redirectUrl);
 
 };

 let logout=(req,res,next)=>{

    // logout is an asynchronous func
        req.logout( (err) =>{ // it removes user id  from session causing logging out 
         
            if (err) {
                 next(err);
            }else{
    
                req.flash("success", "You are logged out!");
                res.redirect("/listings");
                
            }
            });
        };
        module.exports={signup,renderLoginForm,login,renderSignupForm,logout};
        