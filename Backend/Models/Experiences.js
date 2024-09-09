import mongoose from "mongoose";

const experienceSchema=new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    startDate:{
        type:String,
        required:false
    },
    endDate:{
        type:String,
        required:false
    },
    debugger:{
        type:String,
        required:false
    }
})

const Experience=mongoose.model("Experiences",experienceSchema);
export default Experience;