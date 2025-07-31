import { Course } from '../models/courseModel.js';
import { Quiz } from '../models/quizModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createQuiz = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { questions } = req.body;

    if (!questions?.length) {
        throw new ApiError(400, "At least one question is required");
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const quiz = await Quiz.create({ courseId, questions });

    return res.status(201).json(
        new ApiResponse(201, "Quiz created successfully", quiz)
    );
});

export const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    const score = quiz.questions.reduce((acc, question, index) => {
        return acc + (question.correctAnswer === answers[index] ? 1 : 0);
    }, 0);

    const percentage = (score / quiz.questions.length) * 100;

    return res.status(200).json(
        new ApiResponse(200, "Quiz submitted successfully", {
            score,
            total: quiz.questions.length,
            percentage,
            passing: percentage >= 70 // Add passing threshold
        })
    );
});

export const getCourseQuiz = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) {
        throw new ApiError(404, "No quiz found for this course");
    }

    return res.status(200).json(
        new ApiResponse(200, "Quiz retrieved successfully", quiz)
    );
});

export const updateQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const { questions } = req.body;

    if (!questions?.length) {
        throw new ApiError(400, "Questions array cannot be empty");
    }

    const quiz = await Quiz.findByIdAndUpdate(
        quizId,
        { questions },
        { new: true, runValidators: true }
    );

    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Quiz updated successfully", quiz)
    );
});

export const deleteQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Quiz deleted successfully", null)
    );
});