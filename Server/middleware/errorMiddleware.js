import { ApiError } from '../utils/apiError.js';

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';


    // 1. Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        err = new ApiError(400, `Validation Error: ${messages.join(', ')}`);
    }

    // 2. Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err = new ApiError(400, `${field} already exists`);
    }

    // 3. Invalid JWT Token
    if (err.name === 'JsonWebTokenError') {
        err = new ApiError(401, 'Invalid token. Please log in again!');
    }

    // 4. Expired JWT Token
    if (err.name === 'TokenExpiredError') {
        err = new ApiError(401, 'Token expired. Please log in again!');
    }

    // 5. Mongoose Cast Error (invalid ObjectId)
    if (err.name === 'CastError') {
        err = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
    }

    // 6. Multer File Upload Errors
    if (err.name === 'MulterError') {
        err = new ApiError(400, `File upload error: ${err.message}`);
    }

    // 7. Cloudinary Errors
    if (err.name === 'CloudinaryError') {
        err = new ApiError(500, `Media upload failed: ${err.message}`);
    }

    // --- Development vs Production Error Responses ---
    const response = {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    };

    // Log full error in development
    if (process.env.NODE_ENV === 'development') {
        console.error(`[${new Date().toISOString()}] ERROR:`, {
            path: req.path,
            method: req.method,
            status: err.statusCode,
            message: err.message,
            stack: err.stack
        });
    }

    // Send response
    res.status(err.statusCode).json(response);
};

// 404 Not Found Middleware
const notFound = (req, res, next) => {
    next(new ApiError(404, `Not Found - ${req.method} ${req.originalUrl}`));
};

export { errorMiddleware, notFound };
