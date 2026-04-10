import { Errors } from '../errors/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authorize = (requiredRoles) => asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.role) {
        throw Errors.ROLE_NOT_FOUND();
    }
    if (!requiredRoles.includes(req.user.role)) {
        throw Errors.INSUFFICIENT_PERMISSIONS();
    }
    next();
});

