import jwt from "jsonwebtoken"


async function getToken(email,user){
    const token=jwt.sign({identifier:user._id},"mysecretkey");

    return token;
}

export {getToken};