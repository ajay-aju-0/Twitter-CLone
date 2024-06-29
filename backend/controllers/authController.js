import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"

export const signUpController = async(req,res) => {
    try {
        const { fullname, username, email, password } = req.body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const existingUserName = await userModel.findOne({username});
        const existingEmail = await userModel.findOne({email})

        if(!emailRegex.test(email)) {
            return res.status(400).json({
                error:"Invalid Email"
            })
        }
        if(existingUserName) {
            return res.status(400).json({
                error:"Username already exists"
            })
        }
        if(existingEmail) {
            return res.status(400).json({
                error:"An user with this email already exists"
            })
        }
        if(password.length < 6) {
            return res.status(400).json({
                error:"Password must be atleast 6 characters long"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            fullname: fullname,
            username: username,
            email: email,
            password: hashedPassword
        });

        if(newUser) {
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullnaame: newUser._id,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        }else {
            res.status(400).json({
                error:"Invalid user data"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

export const loginController = async(req,res)=>{
    try {
        const { username, password } = req.body

        // console.log(username,password)

        const user = await userModel.findOne({username})
        // console.log(user)
        
        if(!user) {
            return res.status(400).json({
                error:"User does not exist"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password || "")
        
        if(!isPasswordCorrect) {
            return res.status(400).json({
                error:"Invalid Password"
            })
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

export const logoutController = async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({
            message:"Logged out successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

export const getMe = async(req,res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password")
        res.status(200).json({
            user:user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}