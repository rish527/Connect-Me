import mongoose from "mongoose";
import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notification.js"
import { request } from "express";
import User from "../models/user.js";

export const sendConnectionRequest=async(req,res)=>{
    try{
        console.log(req.user);
        const {userId}=req.params;
        const senderId=req.user._id.toString();
        console.log("User making request:", senderId);
        console.log("Target userId:", userId);
        if(senderId==userId){
            return res.status(400).json({message:"You can't send a connection request to yourself"});
        }
        console.log("Not same user");
        
        if(req.user.connection.includes(userId)){
            return res.status(400).json({message:"You're already connected with this user"});
        }
        console.log("Not existing");

        const existingRequest=await ConnectionRequest.findOne({
            sender:senderId,
            receiver:userId,
            status:"pending"
        })
        if(existingRequest){
            return res.status(400).json({message:"A connection already exists"});
        }

        console.log("making request");
        const newRequest=new ConnectionRequest({
            sender:senderId,
            recipient:userId,
        });
        await newRequest.save();

        res.status(201).json({message:"Connection Request sent successfully"});
    }
    catch(error){
        console.error("Error in Connection Send controller",error);
        res.status(500).json({message:"Server error"});
    }
}

export const acceptConnectionRequest=async(req,res)=>{
    try{
        const {requestId}=req.params;
        const userId=req.user._id;

        const request=await ConnectionRequest.findById(requestId)
            .populate("sender","name email username")
            .populate("recipient","name username")

        if(!request){
            return res.status(404).json({message:"Connection request not found"});
        }

        if(request.recipient._id.toString()!==userId.toString()){
            return res.status(403).json({message:"Not authorized to accept this request"});
        }

        if(request.status!=="pending"){
            return res.status(400).json({message:"This request has already beed processed"});
        }

        request.status="accepted";
        await request.save();

        await User.findByIdAndUpdate(request.sender._id,{$addToSet:{connection:userId}});
        await User.findByIdAndUpdate(userId,{$addToSet:{connection:request.sender._id}});

        const notification=new Notification({
            recipient:request.sender._id,
            type:"connectionAccepted",
            relatedUser:userId,
        })
        await notification.save();

        res.json({message:"Connection requst accepted successfully"});

        //todo:send email

    }catch(error){
        console.error("Error in accept Connection controller:",error);
        res.status(500).json({message:"Server error"});
    }
}

export const rejectConnectionRequest=async(req,res)=>{
    try{
        const {requestId}=req.params;
        const userId=req.user._id;

        const request=await ConnectionRequest.findOne(requestId)
            .populate("sender","name email username")
            .populate("recipient","name username")
        
        if(!request){
            return res.status(404).json({message:"Connection request not found"});
        }

        if(request.recipient._id.toString()!==userId.toString()){
            return res.status(403).json({message:"Not authorized to reject this request"});
        }

        if(request.status!=="pending"){
            return res.status(400).json({message:"This request has already been processed"});
        }

        request.status="rejected";
        await request.save();

        const notification= new Notification({
            recipient:request.sender._id,
            type:"connectionRejected",
            relatedUser:userId,
        })
        await notification.save();

        res.json({message:"Coonetion request accepted successfully"});

    }catch(error){
        console.error("Error in reject Connection Controller:",error);
        res.status(500).json({message:"Server error"});
    }
}

export const getConnectionRequests=async(req,res)=>{
    try{
        const userId=req.user._id;
        const connectionRequests=await ConnectionRequest.find({recipient:userId, status:"pending"})
        .populate("sender","name username profilePicture headline connections")

        res.json(connectionRequests);

    }catch(error){
        console.error("Error in getConnectionRequests controller",error);
        res.status(500).json({message:"Server error"});
    }
}

export const getUserConnectons=async(req,res)=>{
    try{
        const userId=req.user._id;
        const user=User.findById(userId)
            .populate("connections","name username profilePicture headline connections")
        
        res.json(user.connections);
    }catch(error){
        console.error("Error in getUserConnections controller",error);
        res.status(500).json({message:"Server error"});
    }
}

export const removeConnection=async(req,res)=>{
    try{
        const myId=req.user._id;
        const {userId}=req.params

        await User.findByIdAndUpdate(myId,{$pull:{connection:userId}});
        await User.findByIdAndUpdate(userId,{$pull:{connection:myId}});

    }catch(error){
        console.error("Error in removeConnection controller",error);
        res.status(500).json({message:"Server error"})
    }
}

export const getConnectionStatus=async(req,res)=>{
    try{
        const myId=req.user._id;
        const targetUser=req.params.userId;

        const currentUser=await User.findById(myId)
        
        if(currentUser.connection.includes(targetUser)){
            return res.json({status:"connected"})
        }
        
        const pendingRequest=await ConnectionRequest.findOne({
            $or:[
                {sender:myId,recipient:targetUser},
                {sender:targetUser,recipient:myId}
            ],
            status:"pending",
        })

        if(pendingRequest){
            if(pendingRequest.sender.toString()===myId.toString()){
                return res.json({status:"pending"});
            }
            else{
                return res.json({status:"received",requestId:pendingRequest._id});
            }
        }

        return res.json({status:"not connected"});

    }catch(error){
        console.error("Error in getConnectionStatus controller",error);
        res.status(500).json({message:"Server error"});
    }
}