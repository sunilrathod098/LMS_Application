import {Course} from '../models/courseModel.js';
import {Lesson} from '../models/lessonModel.js';
import {Resource} from '../models/resourceModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createCourse = asyncHandler(async (req, res) => {
    try {
        const { title, description, price, category } = req.body;
        const instructor = req.user._id;
        if ([title, description, price, category].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }
        const course = await Course.create({
            title,
            description,
            price,
            category,
            instructor
        });
        if (!course) {
            throw new ApiError(500, "Failed to create course");
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                "Course created successfully",
                course
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while creating course: ${error.message}`);
    }
});

export const getAllCourses = asyncHandler(async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name email');
        if (!courses || courses.length === 0) {
            throw new ApiError(404, "No courses found");
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                "Courses retrieved successfully",
                courses
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching courses: ${error.message}`);
    }
});

export const getCourseById = asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId).populate('instructor', 'name email');
        if (!course) {
            throw new ApiError(404, "Course not found");
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                "Course retrieved successfully",
                course
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching course: ${error.message}`);
    }
});

export const updateCourse = asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description, price, category } = req.body;
        if ([title, description, price, category].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const course = await Course.findByIdAndUpdate(courseId, {
            title,
            description,
            price,
            category
        }, { new: true });

        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                "Course updated successfully",
                course
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating course: ${error.message}`);
    }
});


export const deleteCourse = asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        // Optionally delete associated lessons and resources
        await Lesson.deleteMany({ course: courseId });
        await Resource.deleteMany({ course: courseId });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Course deleted successfully"
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while deleting course: ${error.message}`);
    }
});

