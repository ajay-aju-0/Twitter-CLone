import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protectRoute = async(req,res,next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(400).json({
                message:"Unauthorized.. No token provided!"
            })
        }
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded) {
            return res.status(400).json({
                message:"Unauthorized.. Invalid token!"
            })
        }

        const user  = await userModel.findById(decoded.userid).select("-password");

        if(!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectedRoute middleware",error.message);
        return res.status(500).json({
            error: "internal server error"
        })
    }
}