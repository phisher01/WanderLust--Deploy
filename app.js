if(process.env.NODE_ENV!='production'){
    require("dotenv").config();

}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const User=require("./models/user.js");
const passport=require("passport"); //lib and a middleware
const LocalStrategy=require("passport-local"); //lib and a class
const userRouter=require("./routes/user.js"); // lib



// const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


main(). then(()=>{
    console.log("connection  successfull");

}).catch((err)=>{
    console.log(err);
}); 

async function main(){
    await mongoose.connect(dbUrl);

};






const Session=require("express-session");
const MongoStore=require("connect-mongo");

const flash=require("connect-flash");









app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.use(cookieParser("secret")); 



const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:
    {
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,

});

store.on("error",(err)=>{
    console.log("Error in  Mongo Store Session",err);
});


const sessionOptions={
    
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now() +7* 24*60*60*1000,
            maxAge:7* 24*60*60*1000,
            httpOnly:true,
        },
        store:store,

    


};














// app.get("/",(req,res)=>{
//     res.send("I am root");
//    });



        

        app.use(Session(sessionOptions));//session store the info of a particular web session 
        app.use(flash());
        app.use(passport.initialize()); // to initialize passport 
                                        // passport is a library used for authentication
        app.use(passport.session()); // to identify same session and not to login again for another page in same website.

        passport.use(new LocalStrategy(User.authenticate()));
        //telling passport that we are authenticating through localstrategy and authenticate user with User.authenticate(). This method  is added by p-l-mongoose lib to model User
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        //serialize - to store all user's info in session through user id
        //deserialize- to load full info of user via id





    app.use((req,res,next)=>{
   
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
   res.locals.currUser=req.user;


    next();


});



app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
    
    next(new ExpressError (404,"page not found"));
});


app.use((err,req,res,next)=>{
    let {status=505,message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{message});

    

});



app.listen(8080,()=>{
    console.log("servers is listening on port 8080");
});
