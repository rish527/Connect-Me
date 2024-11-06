import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    recipient:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    sender:{type:mongoose.Schema.Types.ObjectId, ref:"User",},
    type:{type:String, enum:["like", "comment", "connectionAccepted"], required:true},
    relatedUser:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    relatedPost:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    read:{type:Boolean, default:false},

},{timestamps:true})

const Notification=mongoose.model("Notification",notificationSchema);

export default Notification;