import express from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./Models/Users.js";

import authRouter from "./routes/auth.js";
import addexperienceRouter from "./routes/experiences.js";
import addskillRouter from "./routes/skills.js";
import addprojectRouter from "./routes/projects.js";

const app=express();
app.use(express.json());
const port = 3000;

dotenv.config();
mongoose.connect(
    "mongodb+srv://RishuDev:"+
    process.env.MONGO_PASSWORD+
    "@linkedinclone.bwbh5.mongodb.net/?retryWrites=true&w=majority&appName=LinkedInClone",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true
    }
).then((x)=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error occured while connecting to MongoBD");
    console.log(err);
});



let opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey='mysecretkey';
passport.use(
    new JwtStrategy(opts, async (jwt_payload,done)=>{
        console.log(jwt_payload);
        try{
            const user=await User.findOne({_id:jwt_payload.identifier});
        
            if(user){
                done(null,user);
            }
            else{
                done(null,false);
            }
        }catch(err){
            if(err){
                done(err,false);
            }
        }
        
    })
);


app.get("/",(req,res)=>{
    res.send("Backend is working....");
})

app.get("/api",(req,res)=>{
    console.log('API Called');
    res.send("API is working....");
})

app.use("/auth",authRouter);
app.use("/experience",addexperienceRouter);
app.use("/skill",addskillRouter);
app.use("/project",addprojectRouter);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})