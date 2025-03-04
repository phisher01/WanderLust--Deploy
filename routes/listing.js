const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const {isLoggedin}=require("../middleware.js");   
const {isOwner}=require("../middleware.js");   
const {validateListing}=require("../middleware.js");   
const listingContoller=require("../controllers/listing.js");
const {storage}=require("../cloudConfig.js");
const multer=require("multer");
const upload=multer({storage });    // multer will store saved files in cloudinary's storage        





router
    .route("/")
    .get(wrapAsync(listingContoller.index))      //index route
    .post(isLoggedin,upload.single("Listing[image]"),validateListing,wrapAsync(listingContoller.createListing));   //create route



router.get("/filter/:category",listingContoller.viewFilteredListing);         // filtered listing
router.get("/new",isLoggedin,listingContoller.renderNewForm);       //New route



router
    .route("/:id")
    .get(wrapAsync(listingContoller.showListing))  // show route
    .put(isLoggedin,isOwner,upload.single("Listing[image]"),validateListing,wrapAsync(listingContoller.updateListing))     //update route  
    .delete(isLoggedin, isOwner,   wrapAsync(listingContoller.destroyListing));   //delete route



router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(listingContoller.renderEditForm)); //Edit Route


module.exports=router;
