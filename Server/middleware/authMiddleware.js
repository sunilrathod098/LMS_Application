import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

//Verify JWT Token
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
        return next(new ApiError('Unauthorized: No token provided', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return next(new ApiError('Invalid or expired token', 401));
    }

    const user = await User.findById(decoded?._id).select('-password -refreshToken');
    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    req.user = user;
    next();
});

//Role-based Access Control Middleware Factory
const checkRole = (role) => {
    return asyncHandler((req, res, next) => {
        if (!req.user) {
            return next(new ApiError('User data missing in request', 401));
        }

        if (req.user.role !== role) {
            return next(new ApiError(`Access denied: ${role}s only`, 403));
        }

        next();
    });
};

// Role-specific Middlewares
export const admin = checkRole('admin');
export const user = checkRole('user');
export const instructor = checkRole('instructor');
