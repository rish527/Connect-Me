import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeMail } from "../emails/emailHandlers.js";

export const signup= async(req,res)=>{
    //1 get the user
    //2 check fro errors
    //3 save to db
    //4 generate jwt and set cookies
    //5 send welcome email 
    try {
        //1
        const {name, username, email, password}=req.body;
        
        //2
        if(!name ||!username || !email || !password){
            return res.status(400).json({message:"Please fill in all fields"})
        }

        const existing=await User.findOne({email});
        if(existing) return res.status(400).json({message:"User email Already Exists"});

        const notUnique=await User.findOne({username});
        if(notUnique) return res.status(400).json({message:"Username Already Exists chose another one"});

        if(password.length<6) return res.status(400).json({message:"Password must be at least 6 characters"});

        

        //3
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const user=new User({
            name,
            username,
            email,
            password:hashedPassword
        });

        await user.save();
        console.log("Data saved to database");
        //4
        const token=jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"1d"} );
        res.cookie("jwt-linkedin",token,{
            httpOnly:true,  //XSS
            maxAge:1*24*60*60*1000,
            sameSite:"strict", //CSRF
            secure:process.env.NODE_ENV==="production"
        })
        res.status(201).json({message:"User registerd successfully"});

        //5 send email
        const profileUrl=process.env.CLIENT_URL+"/profile"+user.username;
        try{
            await sendWelcomeMail(user.email,user.name,profileUrl)
        }catch(emailError){
            console.log("Error in sending welcome Email",emailError);
            // res.status(400).json("Email failed");
        }

    } catch (error) {
        console.log("Error in SignUp:",error.message);
        res.status(500).json({message:"Internal server issue"})
    }
}

export const login= async(req,res)=>{
    try {
        //1 get data
        const {username,password}=req.body;

        //2 chek data
        if(!username || !password){
            return res.status(400).json({message:"Please enter both username and password"});
        }

        
        //3 authenticate
        const user=await User.findOne({username});
        if(!user){ return res.status(400).json({message:"Invalid Credentials"})};

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){ return res.status(400).json({message:"Invalid Credentials"})};

        //4 send token
        const token=jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"1d"})
        res.cookie("jwt-linkedin",token,{
            httpOnly:true,  //XSS
            maxAge:1*24*60*60*1000,
            sameSite:"strict", //CSRF
            // secure:process.env.NODE_ENV==="production",
        });
        res.json({ message: "Logged in successfully" });
    } catch (error) {   
        console.error("Error in login controler",error);
        res.status(500).json({message:"Internal server issue"})
        
    }
};


export function logout(req,res){
    res.clearCookie("jwt-linkedin");
    res.status(200).json({message:"Logged out successfully"});
    console.log("User LogedOut");
}


export function getCurrentUser(req,res){
    try {
        res.json(req.user);
    } catch (error) {
        console.log("Error in getUser controler");
        return res.status(401).json({message:"Server Error"});
    }
}