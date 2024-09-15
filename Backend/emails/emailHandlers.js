import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";


export const sendWelcomeMail= async(email, name, profileUrl )=>{
    const recipient=[{email}];

    try {
        const response=await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Welcome to our community",
            html:createWelcomeEmailTemplate(name,profileUrl),
            category:"welcome"
        });
        console.log("Welcome mail sent Successfuly",response)
    } catch (error) {
        throw error;
    }
}
