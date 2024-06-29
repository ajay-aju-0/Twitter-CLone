import express from "express";
import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import postRoutes from "./routes/postRoute.js"
import notificationRoutes from "./routes/notificationRoute.js"
import dotenv from "dotenv"
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

const app = express();
dotenv.config();   // For reading the contents of env file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PORT = process.env.PORT || 8080;

app.use(express.json({limit:"5mb"})); // For parsing req.body
app.use(express.urlencoded({extended:true})); // For parsing form data

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notification",notificationRoutes);

app.get('/',(req,res)=>{
    res.send("Server is ready")
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB()
})