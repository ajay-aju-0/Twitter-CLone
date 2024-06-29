import mongoose from "mongoose";

const connectMongoDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${conn.connection.port}`)
    } catch (error) {
        console.error("Error connecting to mongo api");
        process.exit(1);
    }
}

export default connectMongoDB;