import express from "express"
import { authrizeRoute } from "../middlewares/authMiddleware.js";
import { createPost, getFeedPosts, deletePost, getPostById, createComment, likePost } from "../controllers/post.controllers.js";

const router=express.Router();

router.get("/",authrizeRoute,getFeedPosts);
router.post("/create",authrizeRoute,createPost);
router.get("/:id",authrizeRoute,getPostById);
router.delete("/delete/:id",authrizeRoute,deletePost);
router.post("/:id/comment",authrizeRoute,createComment);
router.post("/:id/like",authrizeRoute,likePost);

export default router;