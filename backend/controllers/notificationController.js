import notification from "../models/notificationModel.js";

export const getNotifications = async(req,res) => {
    try {
        const userId = req.user._id;
        const notifications = await notification.find({to:userId}).populate({
            path:"from",
            select:"username profileImg"
        })
        await notification.updateMany({to:userId},{read:true})
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications:",error.message);
        res.status(500).json({
            error: error.message
        })
    }
}

export const deleteNotifications = async(req,res) => {
    try {
        const userId = req.user._id;
        await notification.deleteMany({to:userId});

        res.status(200).json({message:"notifications deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNotifications:",error.message);
        res.status(500).json({
            error: error.message
        })
    }
}

export const deleteNotification = async(req,res) => {
    try {
        const userId = req.user._id;
        const notifi = await notification.findById(req.params.id);

        if(!notifi) {
            res.status(400).json({
                error:"Notofication not found"
            })
        }
        if(userId != notifi.to.toString()) {
            res.status(400).json({
                error:"You are not authorised"
            })
        }

        await notification.findByIdAndDelete(notifi._id)

        res.status(200).json({message:"notification deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNotification:",error.message);
        res.status(500).json({
            error: error.message
        })
    }
}