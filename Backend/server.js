import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import {connectDB} from "./lib/db.js";

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);

// app.use("/",(req,res)=>{
//     res.send("Server is Live");
// })



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})