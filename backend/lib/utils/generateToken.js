import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userid, res) => {
    const token = jwt.sign({userid},process.env.JWT_SECRET,{expiresIn:"15d"})

    res.cookie("jwt",token,{
        maxAge: 15*60*60*24*1000,   // Maximum age in milliseconds
        httpOnly: true,             // Prevent cross-site-scripting attacks
        sameSite: "strict",         // Prevent CSRF attacks
        secure: process.env.NODE_ENV !== 'development',
    })
}