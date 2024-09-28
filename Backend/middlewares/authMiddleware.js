import jwt from "jsonwebtoken";
import User from "../models/user.js";
import cookieParser from "cookie-parser";

export async function authrizeRoute(req,res,next){
    try {
        const token=req.cookies['jwt-linkedin'];

        if(!token){
            return res.status(401).json({message:'Unautharized-No token provided'});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unautharized-Invalid token"});
        }

        const user=await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"User not found"})
        }

        req.user=user;
        next();
    } catch (error) {
        console.log("Error in authrization Middleware",error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }

}