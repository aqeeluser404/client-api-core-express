// ─── Error Utilities ─────────────────────────────────────────────

export function handleControllerError(res, error, fallbackStatus = 400, fallbackMessage = 'An error occurred') {
    let status = fallbackStatus || 500;
    let message = fallbackMessage;

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        message = messages.join(', ');
        status = 422;
    }

    // Mongoose Duplicate Key Error
    else if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || error.keyValue || {})[0];
        message = `Duplicate value for field "${field}"`;
        status = 409;
    }

    // Custom thrown error with statusCode
    else if (error.statusCode && error.message) {
        status = error.statusCode;
        message = error.message;
    }

    // Custom error-like object with .status or .statusText
    else if (error.status && error.statusText) {
        status = error.status;
        message = error.statusText;
    }

    // JWT / Auth errors
    else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        status = 401;
        message = 'Invalid or expired token';
    }

    // Axios or fetch-like nested response
    else if (error.response?.data?.message) {
        message = error.response.data.message;
        status = error.response.status || fallbackStatus;
    }

    // Generic fallback
    else if (error.message) {
        message = error.message;
    }

    // Dev logs
    if (process.env.NODE_ENV !== 'production') {
        console.error('[Controller Error]', error.stack || message);
    }

    return res.status(status).json({ 
        success: false, 
        error: message,
        code: error.code || undefined
    });
}