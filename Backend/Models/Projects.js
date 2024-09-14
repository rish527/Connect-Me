import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    links:[
        {type:String}
    ]
})

const Project= mongoose.model("Project",projectSchema);
export default Project; 