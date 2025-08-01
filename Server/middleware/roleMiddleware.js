import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const restrictTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        try {
            if (!roles.includes(req.user?.role)) {
                throw new ApiError(
                    403,
                    'You do not have permission to perform this action'
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    });
};

export const instructor = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
            throw new ApiError(
                403,
                'This action requires instructor or admin privileges'
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const admin = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            throw new ApiError(403, 'This action requires admin privileges');
        }
        next();
    } catch (error) {
        next(error);
    }
});