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
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import progress from "./routes/progressRoutes.js";
import quizRoutes from "./routes/quizRouters.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/progress", progress);


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