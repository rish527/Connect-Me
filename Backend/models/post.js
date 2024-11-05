import mongoose from "mongoose";
import  User  from "./user.js";

const postSchema =new mongoose.Schema({
    auther:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:"true"},
    content:{type:String},
    img:{type:String, default:""},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    comments:[{
        content:{type:String},
        auther:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
        createdAt:{type:Date, default:Date.now},
    }],

},{timestamps:true});

const Post=mongoose.model("Post",postSchema);

export default Post;