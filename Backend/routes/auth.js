import express from "express";
import bcrypt from "bcrypt";
import Users from "../Models/Users.js";
import { getToken } from "../utils/helpers.js";


const router=express.Router();

router.post("/register",async(req,res)=>{
    //1 get the data from request
    const {firstName,lastName,email,password}=req.body;

    //1.5 verify if all req is satisfies
    if(!firstName || !email ||!password){
        return res.status(400).json({err:"This request is Invalid"});
    }

    //2 check if it already exists
    const alreadyExists=await Users.findOne({email:email});
    if(alreadyExists){
        return res.status(402).json({err:"User already exists"});
    }

    //3 Register the user in database
    const crypedPass=await bcrypt.hash(password,10);
    const newUserDetails={
        firstName,
        lastName,
        email,
        password:crypedPass
    }
    const newUser=await Users.create(newUserDetails);

    const token=await getToken(email,newUser);

    const usertoReturn={...newUser.toJSON(),token};
    delete usertoReturn.password;

    return res.status(200).json(usertoReturn);

})

router.post("/login", async(req,res)=>{
    //1 get data
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(401).json({err:"invalid email or password"});
    }

    //2 chek if it exists
    const user=await Users.findOne({email:email});
    if(!user.email){
        return res.status(401).json({err:"invalid email or password"});
    }

    //3 check if password is correct
    const valid=await bcrypt.compare(password,user.password);
    if(!valid){
        return res.status(401).json({err:"invalid email or password"});
    }

    //4 send token
    const token=await getToken(email,user);
    const usertoReturn={...user.toJSON(),token};
    delete usertoReturn.password;

    return res.status(200).json(usertoReturn);
});

export default router;