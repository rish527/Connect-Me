import mongoose  from "mongoose";

const skillSchema=new mongoose.Schema({
    skillName:{
        type:String,
        required:true
    }
})

const Skill=new mongoose.model("Skill",skillSchema);
export default Skill;