const cloudinary=require("cloudinary").v2; //importing this library for accessing cloudinary account using credentials
const {CloudinaryStorage}=require("multer-storage-cloudinary"); //importing CloudinaryStorage class form library to create a storage

console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,  
      

});
  
    // creating a storage for mentioning where to store files(i.e folder) in cloudinary
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
        params:{
            folder:"wanderlust_DEV",
            allowed_formats:["png","jpeg","jpg"],
            

        },

});


module.exports={    
    cloudinary,
    storage,

};