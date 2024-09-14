import express from 'express'
import passport from 'passport'
import Projects from '../Models/Projects.js'

const router=express.Router();

router.post("/create",
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        //1 identify who is calling
        const user=req.user;

        //2 careate project obj
        const {name,description,links}=req.body;
        if(!name){
            return res.status(402).json({err:"Invalid Data"});
        }

        const projectObj={
            name,
            description,
            links
        }
        const project=await Projects.create(projectObj);

        //3 add project to database
        user.projects.push(project._id);
        await user.save();

        //4 send response back to user
        res.status(200).json(project);
    }
)

export default router;
