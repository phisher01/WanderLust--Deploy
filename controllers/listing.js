const axios = require('axios');


const Listing=require("../models/listing");


const ExpressError=require("../utils/ExpressError");


let index = async (req, res) => {
    let { data } = req.query;
    let allListing;

    if (data) {
        allListing = await Listing.find({
            $or: [
                { country: { $regex: new RegExp(data, 'i') } },
                { title: { $regex: new RegExp(data, 'i') } },
                { location: { $regex: new RegExp(data, 'i') } }
            ]
        });
    } else {
        allListing = await Listing.find();
    }

    let obj = { allListing };
    res.render("listing/index.ejs", obj);
};


let viewFilteredListing=async (req,res)=>{
    let {category}=req.params;
    
    let allListing =await Listing.find({category});
   
    let obj={allListing};
    

    res.render("listing/index.ejs",obj);
};


let renderNewForm=(req,res)=>{
   
    res.render("listing/new.ejs");
     
 }

let showListing= async (req,res,next)=>{
  

    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");


   
    if(!listing){
       
     req.flash("error","Listing you requested for does not exist");
     res.redirect("/listings");
    }else{
            

            res.render("listing/show.ejs",{listing}); 
         
    }
};

   


     
        
      


let createListing=async(req,res,next)=>{
    
    let newListing=new Listing(req.body.Listing);
    console.log(newListing);
    let url=req.file.path;
    let filename=req.file.filename;
    
    newListing.owner=req.user.id;
    newListing.image={url,filename};
    
    
    const url1 = `https://api.maptiler.com/geocoding/${encodeURIComponent(newListing.location)}.json?key=${process.env.MAP_ACCESS_TOKEN}`;
    const response = await axios.get(url1);
    const data = response.data;

    if (data.features && data.features.length > 0) {
       newListing.geometry = data.features[0].geometry;
      
      
       
    } else {
        throw new ExpressError('No geocoding results found.',404);
    }

      
        




    
    
    console.log(await newListing.save());
    req.flash("success","New Listing Created!");
    res.redirect("/listings");



}

let renderEditForm=async (req,res)=>{
   

    let {id}=req.params;
    const listing=await Listing.findById(id); 

    let changedUrl=listing.image.url.replace("/update","/update/w_250");

    res.render("listing/edit.ejs",{listing,changedUrl});


}



let updateListing=async (req,res)=>{
   
    let {id}=req.params;
    
    
   let listing=await Listing.findByIdAndUpdate(id,{  ...req.body.Listing},{runValidators:true});

   if(req.file){
       let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};

       listing.save();

   }
  
    
    req.flash("success","Listing Updated");

    res.redirect(`/listings/${id}`);
    
    
}

let destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    
 
    req.flash("success","Listing Deleted");

     res.redirect("/listings");
    
}
module.exports={index,renderEditForm,renderNewForm, updateListing,createListing,destroyListing,showListing,viewFilteredListing};

