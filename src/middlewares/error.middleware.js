import { ENV } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
    if (ENV.NODE_ENV === 'development') {
        console.error(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_SERVER_ERROR';

    res.status(statusCode).json({
        success: false,
        code: code,
        message: message,
    });
};