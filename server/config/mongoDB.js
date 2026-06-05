import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        mongoose.connection.on("connected", () => {
            logger.info("MongoDB connected");
        });

        mongoose.connection.on("error", (err) => {
            logger.error({ err }, "MongoDB error");
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed (app termination)");
            process.exit(0);
        });

    } catch (error) {
        logger.fatal({ error }, "DB Connection Failed");
        process.exit(1);
    }
};

export default connectDB;