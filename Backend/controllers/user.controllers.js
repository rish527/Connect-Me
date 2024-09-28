import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js"

export const getSuggestions= async(req,res)=>{
    try {
        const user=req.user;
        const connections=user.connections;

        const suggestions=await User.find({
            _id:{$ne:user._id, $nin:connections}
        }).select("name username profilePicture headline")
        .limit(3);

        res.status(200).json(suggestions);
    } catch (error) {
        console.log("Error in getSuggestions:",error)
        res.status(400).json({message:"Internal Server Error"});
    }
}

export const getPublicProfile= async(req, res)=>{
    try {
        const user=await User.findOne({username:req.params.username}).select("-password");
        if(!user){res.status(404).json({messege:"User not Found"})};

        res.json(user);
    } 
    catch (error) {
        console.log("Error in getPublicProfile: ",error);
        res.status(400).json({message:"Internal Server Error"});
    }
}

export const updateUserProfile=async(req,res)=>{
    try {
        const userId=req.user._id;

        const allowed=[
            "name",
            "username",
            "headline",
            "profilePicture",
            "bannerImg",
            "location",
            "about",
            "skills",
            "experience",
            "education", 
        ];

        const updated={};
        for(var field of allowed){
            if(req.body[field]){
                updated[field]=req.body[field];
            }
        }
        
        //set pictures
        if(req.body.profilePicture){
            const result=await cloudinary.uploader.upload(req.body.profilePicture);
            updated.profilePicture=result.secure_url;
        }
        if(req.body.bannerImg){
            const result=await cloudinary.uploader.upload(req.body.bannerImg);
            updated.bannerImg=result.secure_url;
        }



        const user=await User.findByIdAndUpdate(userId,{$set:updated},{new:true}).select("-password");
        res.json(user);


    } catch (error) {
        console.log("Error in updateUserProfile: ",error);
        res.status(400).json({message:"Internal Server Error"});
    }
}