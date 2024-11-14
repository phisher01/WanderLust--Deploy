const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview}=require("../middleware.js");
const {isLoggedin}=require("../middleware.js");  
const {isAuthor}=require("../middleware.js");  
const reviewController=require("../controllers/review.js");




// create reviews route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReveiw));



//delete reviews
router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewController.deleteReview));


;
module.exports=router;