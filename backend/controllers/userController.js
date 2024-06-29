import notification from "../models/notificationModel.js";
import userModel from "../models/userModel.js" 
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"

export const getUserProfile = async(req,res) => {
    const { username } = req.params;

    try {
        const user = await userModel.findOne({username}).select("-password");
        if(!user){
            return res.status(400).json({
                error: "user not found"
            })
        }
        res.status(200).json(user);

    } catch (error) {
        console.log("Error in getUserProfile:",error.message);
        res.status(500).json({
            error: error.message
        })
    }
}

export const followUnfollowUser = async(req,res) => {
    try {
        const { id } = req.params;
        const userToModify = await userModel.findById(id);
        const currentUser = await userModel.findById(req.user._id);

        if(id === req.user._id.toString()) {
            return res.status(400).json({
                error:"You can't follow/unfollow yourself"
            })
        }
        if(!userToModify || !currentUser) {
            return res.status(400).json({
                error:"User Not Found"
            })
        }

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing) {
            // Unfollow the user
            await userModel.findByIdAndUpdate(id, { $pull : { followers : req.user._id }})
            await userModel.findByIdAndUpdate(req.user._id, { $pull: { following : id }})

            res.status(200).json({
                message:"User unfollowed successfully"
            })
        }else {
            // Follow the user
            await userModel.findByIdAndUpdate(id, { $push : { followers : req.user._id }})
            await userModel.findByIdAndUpdate(req.user._id, { $push: { following : id }})

            const newNotification = new notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
            await newNotification.save();

            res.status(200).json({
                message:"User followed successfully"
            })
        }

    } catch (error) {
        console.log("Error in followUnfollowUser:",error.message);
        res.status(500).json({
            error: error.message
        })
    }
}

export const getSuggestedUsers = async(req,res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await userModel.findById(userId).select("following");

        const users = await userModel.aggregate([
            {
                $match:{
                    _id: {$ne:userId}
                }
            },
            {$sample:{size:10}}
        ])

        const filterUsers = users.filter(user=>!userFollowedByMe.following.includes(user._id));
        const suggestedUsers = filterUsers.slice(0,4);

        suggestedUsers.forEach(user => user,users.password=null)
        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log("Error in getSuggestedUsers:",error.message);
        res.status(500).json({
            error: error.message
        })
    }
}

export const updateUserProfile = async(req,res) => {
    const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await userModel.findById(userId);
        if(!user){
            return res.status(400).json({
                error: "User not found"
            })
        }
        if((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({
                error: "Please provide both current password and new password"
            })
        }
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password)

            if(!isMatch){
                return res.status(400).json({
                    error:"Current Password is incorrect"
                })
            }
            if(newPassword.length < 6){
                return res.status(400).json({
                    error:"Password must be atleast 6 characters long"
                })
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword,salt)
        }
        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }
        
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        await user.save()
        user.password = null;  // Password should be null in response

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUserProfile:",error.message);
        res.status(500).json({
            error: error.message
        })
    }

}