const Listing=require("../models/listing");
const Review=require("../models/review");





let createReveiw=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    
    let newReview=new Review(req.body.Review);
    newReview.author=req.user._id;
 
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save()
    req.flash("success","New Review Created!");

    
    res.redirect(`/listings/${listing._id}`);
}
    


    let deleteReview=async(req,res)=>{
        let {id,reviewId}=req.params;
        
        await Review.findByIdAndDelete(reviewId);
    
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    
        req.flash("success","Review Deleted!");
    
        res.redirect(`/listings/${id}`);
    
            
    
    }


     


module.exports={createReveiw,deleteReview};
