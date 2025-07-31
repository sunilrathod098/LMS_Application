import { Course } from '../models/courseModel.js';
import { Enrollment } from '../models/enrollmentModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const enrollUser = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            throw new ApiError(400, "User is already enrolled in this course");
        }

        const enrollment = await Enrollment.create({
            userId,
            courseId,
            enrolledAt: new Date()
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                "Enrollment successful",
                enrollment
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while enrolling: ${error.message}`);
    }
});

export const getUserEnrollments = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const enrollments = await Enrollment.find({ userId })
            .populate('courseId', 'title description');

        return res.status(200).json(
            new ApiResponse(
                200,
                "Enrollments fetched successfully",
                enrollments
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching enrollments: ${error.message}`);
    }
});

export const unenrollUser = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });
        if (!enrollment) {
            throw new ApiError(404, "Enrollment not found");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                "Unenrolled successfully",
                null
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while unenrolling: ${error.message}`);
    }
});