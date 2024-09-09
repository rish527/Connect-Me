import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    links:[
        {type:String}
    ]
})

const Project= mongoose.model("Project",projectSchema);
export default Project; 