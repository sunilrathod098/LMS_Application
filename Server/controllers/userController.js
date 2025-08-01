import {Enrollment} from '../models/enrollmentModel.js';
import {Progress} from '../models/progressModel.js';
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getAllUsers = asyncHandler(async (_, res) => {
    try {
        const users = await User.find().select("-password -refreshToken");
        if (!users || users.length === 0) {
            throw new ApiError(404, "No users found");
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                "Users retrieved successfully",
                users
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching users: ${error.message}`);
    }
});

export const getUserById = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                "User retrieved successfully",
                user
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching user: ${error.message}`);
    }
});

export const updateUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, role } = req.body;

        if ([name, email, role].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const user = await User.findByIdAndUpdate(userId, { name, email, role }, { new: true, runValidators: true }).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                "User updated successfully",
                user
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating user: ${error.message}`);
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        // Optionally, delete related enrollments and progress
        await Enrollment.deleteMany({ user: userId });
        await Progress.deleteMany({ user: userId });
        return res.status(200).json(
            new ApiResponse(
                200,
                "User deleted successfully",
                null
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while deleting user: ${error.message}`);
    }
});