export class ApiError extends Error {
    constructor(
        message = 'Something went wrong',
        statusCode,
        error = [],
        stack = '',
        data = null
    ) {
        super(message);
        this.statusCode = statusCode || 500;
        this.data = data;
        this.error = error;
        this.stack = stack;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}