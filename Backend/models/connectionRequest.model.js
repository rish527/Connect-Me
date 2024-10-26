import mongoose from "mongoose";
import User from "./user.js";
import { request } from "express";

const connectionRequestSchema=new mongoose.Schema(
    {
      sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
      },
      recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
      },
      status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending",
      }  
    },
    {timestamps:true}
);

const  ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema);

export default ConnectionRequest;