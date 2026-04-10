import { AppError } from "../utils/AppError.js";

export const Errors = {
    // Authentication errors
    NO_TOKEN: () => new AppError('No token provided', 401, 'NO_TOKEN'),
    INVALID_TOKEN_FORMAT: () => new AppError('Invalid token format', 400, 'INVALID_TOKEN_FORMAT'),
    INVALID_TOKEN_PAYLOAD: () => new AppError('Invalid token payload', 401, 'INVALID_TOKEN_PAYLOAD'),
    TOKEN_EXPIRED: () => new AppError('Token has expired', 401, 'TOKEN_EXPIRED'),
    INVALID_TOKEN: () => new AppError('Invalid token', 401, 'INVALID_TOKEN'),
    SESSION_NOT_FOUND: () => new AppError('Session not found', 401, 'SESSION_NOT_FOUND'),
    USER_NOT_FOUND: () => new AppError('User not found', 404, 'USER_NOT_FOUND'),
    USER_ALREADY_EXISTS: () => new AppError('User already exists', 409, 'USER_ALREADY_EXISTS'),
    EMAIL_NOT_VERIFIED: () => new AppError('Email not verified', 403, 'EMAIL_NOT_VERIFIED'),
    INVALID_CREDENTIALS: () => new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'),
    INVALID_PAYLOAD: () => new AppError('Invalid request payload', 400, 'INVALID_PAYLOAD'),
    INVALID_GOOGLE_TOKEN: () => new AppError('Invalid Google token', 401, 'INVALID_GOOGLE_TOKEN'),
    MISSING_GOOGLE_TOKEN: () => new AppError('Google token is required', 400, 'MISSING_GOOGLE_TOKEN'),
    ALREADY_VERIFIED: () => new AppError('Email is already verified', 400, 'ALREADY_VERIFIED'),
    ROLE_NOT_FOUND: () => new AppError('User role not found', 403, 'ROLE_NOT_FOUND'),
    INSUFFICIENT_PERMISSIONS: () => new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'),

    // General server error
    INTERNAL_SERVER_ERROR: () => new AppError('Internal server error', 500, 'INTERNAL_SERVER_ERROR'),

};