const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const   {listingSchema}=require("./schema.js");
const   {reviewSchema}=require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");


let isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){// passport gives this fun to req object for authentication
               // it simply check session that is there user's id or not 
                // if it contains then user's logged in .  
                                                                                    
        req.session.redirectUrl=req.originalUrl;
        
        
        
        req.flash("error","You must be logged in for this operation!"); 
        res.redirect("/login");
    }else{
        
           next();

       }    
}


let saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


let isOwner=wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return       res.redirect(`/listings`);
       }

   
    if(!listing.owner.equals(req.user._id)){
               req.flash("error","You are not the owner of this property!");
             return       res.redirect(`/listings/${id}`);
    }
           next();
           
});


let validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();

    }


};

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();

    }


};

let isAuthor=wrapAsync(async(req,res,next)=>{
    
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review){    
        req.flash("error","Review you want to delete already deleted!");
          return res.redirect(`/listings${id}`);
       }

  
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not the author of this review!");
       
             return       res.redirect(`/listings/${id}`);
    }
        next(); 

    
           
}
);


module.exports={isLoggedin,saveRedirectUrl,isOwner,validateListing,validateReview,isAuthor};