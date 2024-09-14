import express from 'express'
import passport from 'passport'
import ExtractJWT from 'passport-jwt';
import Experiences from "../Models/Experiences.js"

const router=express.Router();


router.post("/create",
    passport.authenticate("jwt",{session:false}),
    async (req,res)=>{
        //1 identify who is calling
        const user=req.user;

        //2 careate experience obj
        const {companyName,position,startDate,endDate,description}=req.body;

        if(!companyName||!position){
            return res.status(402).json({err:"invalid data"})
        }
        const expObj={
            companyName,
            position,
            startDate,
            endDate,
            description
        }
        const experience=await Experiences.create(expObj)
        console.log(experience);
        //3 add exp to database
        user.experiences.push(experience._id)
        await user.save()


        //4 send response back to user
        return res.status(200).json(experience)
    }
)

export default router;








//1 identify who is calling
//2 careate experience obj
//3 add exp to database
//4 send response back to user