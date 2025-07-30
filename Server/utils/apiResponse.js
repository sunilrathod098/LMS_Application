export class ApiResponse {
    constructor(
        message = 'success',
        statusCode,
        data,
    ) {
        this.message = message;
        this.statusCode = statusCode || 200;
        this.data = data || null;
        this.success = statusCode >= 200 && statusCode < 300;
    }
}