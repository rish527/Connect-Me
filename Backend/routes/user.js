import express from "express";
import { authrizeRoute } from "../middlewares/authMiddleware.js";
import {getSuggestions, getPublicProfile, updateUserProfile} from "../controllers/user.controllers.js";

const router=express.Router();
router.get("/suggestions", authrizeRoute, getSuggestions);
router.get("/:username", getPublicProfile);

router.put("/update",authrizeRoute, updateUserProfile)

export default router;