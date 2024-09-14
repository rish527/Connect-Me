import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    experiences:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Experience"
    }],
    skills:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Skill"
    }],
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }]
})

const User=mongoose.model("User",userSchema);

export default User;