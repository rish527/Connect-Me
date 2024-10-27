import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postsRoutes from "./routes/posts.js"
import notificationRoutes from "./routes/notification.js"
import connectionRoutes from "./routes/connection.js"
import {connectDB} from "./lib/db.js";

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json({limit:"5mb"}));
app.use(cookieParser());



app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/posts",postsRoutes);
app.use("/api/v1/notifications",notificationRoutes);
app.use("/api/v1/connections",connectionRoutes)

// app.use("/",(req,res)=>{
//     res.send("Server is Live");
// })



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})