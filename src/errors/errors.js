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
    ALREADY_VERIFIED: () => new AppError('Email is already verified', 400, 'ALREADY_VERIFIED'),
    ROLE_NOT_FOUND: () => new AppError('User role not found', 403, 'ROLE_NOT_FOUND'),
    INSUFFICIENT_PERMISSIONS: () => new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'),

    // Drug errors
    DRUG_NOT_FOUND: () => new AppError('Drug not found', 404, 'DRUG_NOT_FOUND'),
    DRUG_ALREADY_EXISTS: () => new AppError('Drug with this name already exists', 409, 'DRUG_ALREADY_EXISTS'),

    // User errors
    PROFILE_UPDATE_FAILED: () => new AppError('Failed to update profile', 500, 'PROFILE_UPDATE_FAILED'),
    INVALID_ROLE: () => new AppError('Invalid user role', 400, 'INVALID_ROLE'),
    INVALID_STATUS: () => new AppError('Invalid user status', 400, 'INVALID_STATUS'),
    INVALID_THEME: () => new AppError('Invalid theme. Allowed values: light, dark', 400, 'INVALID_THEME'),
    INVALID_LANGUAGE: () => new AppError('Invalid language. Allowed values: en, ar, fr', 400, 'INVALID_LANGUAGE'),

    // Prescription / Access Code errors
    PRESCRIPTION_NOT_FOUND: () => new AppError('Prescription not found', 404, 'PRESCRIPTION_NOT_FOUND'),
    ACCESS_CODE_INVALID: () => new AppError('Access code is invalid, expired, used, or not allowed', 403, 'ACCESS_CODE_INVALID'),

    // General server error
    INTERNAL_SERVER_ERROR: () => new AppError('Internal server error', 500, 'INTERNAL_SERVER_ERROR'),

};