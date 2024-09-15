import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{type:String, require:true, unique:true},
    email:{type:String, require:true, unique:true},
    password:{type:String, require:true},
    profilePicture:{
        type:String,
        default:""
    },
    bannerImg:{
        type:String,
        default:""
    },
    headline:{
        type:String,
        default:"LinkedIn User"
    },
    location:{
        type:String,
        default:"Earth"
    },
    about:{
        type:String,
        default:""
    },
    skills:[String],
    experience:[
        {
            tittle:String,
            company:String,
            location:String,
            startDate:Date,
            endDate:Date,
            description:String
        },
    ],
    education:[
        {
            school:String,
            fieldOfStudy:String,
            startyear:Number,
            endyear:Number,
        },
    ],
    connection:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}]

},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;