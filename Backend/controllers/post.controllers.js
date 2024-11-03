import User from "../models/user.js";
import Post from "../models/post.js";
import Notification from "../models/notification.js";

import cloudinary from "../lib/cloudinary.js";

export async function getFeedPosts(req,res){
    try {
        const posts=await Post.find({auther:{$in:req.user.connection}})
        .populate("auther","name username profilePicture headline")
        .populate("comments.auther","name username profilePicture")
        .sort({createdAt:-1});

        res.status(200).json(posts);

    } catch (error) {
        console.log("Error in the getFeedPosts Controler:",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function createPost(req,res){
    try {
        let {content, image}=req.body;
        console.log(image);
        let newPost;
        if(image){
            try {
                const imgResult = await cloudinary.uploader.upload(image);
                newPost = new Post({
                    auther: req.user._id,
                    content,
                    img: imgResult.secure_url,
                });
                
            } catch (cloudinaryError) {
                console.log("Error uploading image to Cloudinary:", cloudinaryError);
                return res.status(500).json({ message: "Image upload failed" });
            }
        }
        else{
            console.log("No image")
            newPost=new Post({
                auther:req.user._id,
                content
            })
        }

        await newPost.save();
        console.log("New Post:",newPost);

        res.status(201).json(newPost);

    } catch (error) {
        console.log('Error in the postCreate Controler:',error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function deletePost(req,res){
    try {
        const userId=req.user._id;
        const postId=req.params.id;

        const post=await Post.findById(postId);

        if(!post){
            res.status(400).json({message:"Page not found"});
        }

        if(post.auther.toString()!==userId.toString()){
            res.status(401).json({message:"You are not allowed to delete this post"});
        }
        
        if(post.img){
            await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);
        }
        else{
            await Post.findByIdAndDelete(postId);
        }

    } catch (error) {
        console.log('Error in the deletePost Controler:',error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getPostById(req,res){
    try {
        // const userId=req.user._id;
        const postId=req.params.id;

        const post=await Post.findById(postId)
        .populate("auther","name username profilePicture headline")
        .populate("comments.auther","name profilePicture username headline")

        res.status(200).json(post);

    } catch (error) {
        console.log('Error in the getPostById Controler:',error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function createComment(req,res){
    try {
        const postId=req.params.id;
        const {content}=req.body;

        const post=await Post.findByIdAndUpdate(postId,{$push:{comments:{auther:req.user_id, content}}},{new:true})
        .populate("auther","name email username headline profilePicture");

        if(post.auther.toString()!==req.user._id.toString()){
            const notification=new Notification({
                recipient:post.auther,
                type:"comment",
                relatedUser:req.user._id,
                relatedPost:postId
            })
            await notification.save();
        }
        res.status(201).json(post);
    } catch (error) {
        console.log('Error in the createComment Controler:',error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function likePost(req,res){
    try {
        const postId=req.params.id;
        const userId=req.user._id;
        const post=await Post.findById(postId);

        if(post.likes.includes(userId)){
            await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}},{new:true})
        }
        else{
            post.likes.push(userId);
            if(post.auther.toString()!==userId.toString()){
                const newNotification=new Notification({
                    recipient:post.auther,
                    type:"like",
                    relatedUser:userId,
                    relatedPost:postId,
                });

                await newNotification.save();
            }
            res.status(201).json(post);
        }

    } catch (error) {
        console.error("Error in likePost controller:",error);
        res.status(500).json({message:"Internal server error"});
    }
}