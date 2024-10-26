import express from "express";
import { authrizeRoute } from "../middlewares/authMiddleware.js";
import { sendConnectionRequest,acceptConnectionRequest, rejectConnectionRequest, getConnectionRequests, getUserConnectons, removeConnection, getConnectionStatus } from "../controllers/connection.controllers.js";

const router=express.Router();

router.post("/request/:userId",authrizeRoute, sendConnectionRequest);

router.put("/accept/:requestId",authrizeRoute, acceptConnectionRequest);
router.put("/reject/:requestId",authrizeRoute, rejectConnectionRequest);

router.get("/requests",authrizeRoute,getConnectionRequests);

router.get("/",authrizeRoute,getUserConnectons);
router.delete("/:userId",authrizeRoute,removeConnection);
router.get("/status/:userId",authrizeRoute,getConnectionStatus);

export default router;