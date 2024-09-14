import express from 'express';
import passport from 'passport';
import Skills from "../Models/Skills.js";

const router = express.Router();

router.post("/create",
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            // 1. Identify who is calling (logged-in user)
            const user = req.user;

            // Log the user to see if it's being properly set
            console.log("Authenticated user:", user);

            // 2. Create skill object from request body
            const { skillName } = req.body;
            if (!skillName) {
                return res.status(400).json({ error: "Invalid data. Skill name is required." });
            }

            const skillObj = { skillName };
            const skill = await Skills.create(skillObj);

            // 3. Add skill to user's skill array
            user.skills.push(skill._id);
            await user.save();

            // 4. Send the new skill as a response
            return res.status(201).json(skill);

        } catch (error) {
            console.error("Error in /create route:", error);
            return res.status(500).json({ error: "Server error. Please try again later." });
        }
    }
);

export default router;
