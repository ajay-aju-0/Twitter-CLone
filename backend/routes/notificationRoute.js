import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getNotifications, deleteNotifications, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/",protectRoute,getNotifications);
router.delete("/",protectRoute,deleteNotifications);
router.delete("/:id",protectRoute,deleteNotification)



export default router;