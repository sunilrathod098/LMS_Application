import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";


dotenv.config({ path: "./.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static(path.join(__dirname, "../public")))
app.use(cookieParser())



// Importing routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import enrollmentRoutes from '/routes'








const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running http://localhost:${PORT}`);
    })
    app.on('error', (error) => {
        logger.error(`Server error: ${error.message}`);
        throw error;
    })
}).catch((error) => {
    logger.error(`Database connection Failed: ${error.message}`);
    process.exit(1);
})