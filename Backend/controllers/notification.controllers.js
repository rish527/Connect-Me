import { json } from "express";
import Notification from "../models/notification.js"

export const getUserNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ recipient: req.user._id })
			.sort({ createdAt: -1 })
			.populate("relatedPost", "content img")
			.populate("relatedUser", "name username profilePicture")

		res.status(200).json(notifications);
	} catch (error) {
		console.error("Error in getUserNotifications controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


export const markNotificationAsRead=async(req,res)=>{
    try {
        const notificationId=req.params.id;
        const notification=await Notification.findByIdAndUpdate({_id:notificationId, recipient:req.user._id},{read:true},{new:true});
        res.json(notification);
    } catch (error) {
        console.error("Error in markNotificationAsRead controller:",error);
        res.status(500).json({message:"Internal server error"});
        
    }

}

export const deleteNotification=async(req,res)=>{
    try {
        const notificationId=req.params.id;
        await Notification.findByIdAndDelete({_id:notificationId,recipient:req.user._id});
        res.json({message:"Notification deleted successfully"});
    } catch (error) {
        console.error("Error in deleteNotification controller:",error);
        res.status(500).json({message:"Internal server error"});
        
    }

}
