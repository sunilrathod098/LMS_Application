import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_DB);
        logger.info("Database connected successfully");
    } catch (error) {
        logger.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
};
