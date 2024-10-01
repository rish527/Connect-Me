import express from "express";
import { authrizeRoute } from "../middlewares/authMiddleware.js";
import {getUserNotifications, markNotificationAsRead, deleteNotification} from "../controllers/notification.controllers.js"

const router=express.Router();

router.get("/",authrizeRoute,getUserNotifications);
router.put("/:id/read",authrizeRoute,markNotificationAsRead);
router.delete("/:id",authrizeRoute,deleteNotification);

export default router;