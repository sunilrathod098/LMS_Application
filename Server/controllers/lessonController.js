import { uploadOnCloud } from '../config/cloudinary.js';
import { Course } from '../models/courseModel.js';
import { Lesson } from '../models/lessonModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createLesson = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title } = req.body;

        if (!title || title.trim() === "") {
            throw new ApiError(400, "Title is required");
        }

        const videoLocalPath = req.file?.path.replace(/\\/g, "/");
        if (!videoLocalPath) {
            throw new ApiError(400, "Video file is required");
        }

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        const video = await uploadOnCloud(videoLocalPath, "video");
        if (!video.url) {
            throw new ApiError(500, "Failed to upload video");
        }

        const lesson = await Lesson.create({
            courseId,
            title,
            videoUrl: video.url,
            duration: video.duration || 0
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                "Lesson created successfully",
                lesson
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while creating lesson: ${error.message}`);
    }
});

export const updateLesson = asyncHandler(async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { title } = req.body;

        if (!title || title.trim() === "") {
            throw new ApiError(400, "Title is required");
        }

        const lesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { title },
            { new: true }
        );

        if (!lesson) {
            throw new ApiError(404, "Lesson not found");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                "Lesson updated successfully",
                lesson
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating lesson: ${error.message}`);
    }
});

export const deleteLesson = asyncHandler(async (req, res) => {
    try {
        const { lessonId } = req.params;

        const lesson = await Lesson.findByIdAndDelete(lessonId);
        if (!lesson) {
            throw new ApiError(404, "Lesson not found");
        }

        // Optional: Delete video from Cloudinary
        // await deleteFromCloudinary(lesson.videoUrl);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Lesson deleted successfully",
                null
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while deleting lesson: ${error.message}`);
    }
});

export const getCourseLessons = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;

        const lessons = await Lesson.find({ courseId });
        return res.status(200).json(
            new ApiResponse(
                200,
                "Lessons fetched successfully",
                lessons
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching lessons: ${error.message}`);
    }
});