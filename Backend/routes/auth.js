import express from "express";
import {login, logout, signup, getCurrentUser} from "../controllers/auth.controllers.js"
import { authrizeRoute } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.get("/user",authrizeRoute,getCurrentUser);

export default router;