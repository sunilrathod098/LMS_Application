import { Progress } from '../models/progressModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateProgress = asyncHandler(async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = req.user._id;

        let progress = await Progress.findOne({ userId, courseId });

        if (!progress) {
            progress = await Progress.create({
                userId,
                courseId,
                completedLessons: [lessonId]
            });
        } else {
            if (!progress.completedLessons.includes(lessonId)) {
                progress.completedLessons.push(lessonId);
                await progress.save();
            }
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                "Progress updated successfully",
                progress
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating progress: ${error.message}`);
    }
});

export const getUserProgress = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const progress = await Progress.findOne({ userId, courseId })
            .populate('completedLessons', 'title');

        return res.status(200).json(
            new ApiResponse(
                200,
                "Progress fetched successfully",
                progress || { completedLessons: [] }
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching progress: ${error.message}`);
    }
});