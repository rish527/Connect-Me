import mongoose from "mongoose";

export async function connectDB(){
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    }
    catch(error){
        console.error(`Error in connecting with MongoDB:${error.message}`);
        process.exit(1);
    }
}