import * as AuthModel from '../models/Auth.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { Errors } from '../errors/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler ( async (req, res, next) => {
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.accessToken;
        
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.slice(7);
        }

        // Validate token presence and format
        if (!token) {
            throw Errors.NO_TOKEN();
        }
        if (typeof token !== 'string' || token.trim() === '' || token.length > 2048) {
            throw Errors.INVALID_TOKEN_FORMAT();
        }

        const decoded = verifyAccessToken(token);
        if (!decoded || !decoded.id || !decoded.sessionId || decoded.iss !== 'Sihatek' || decoded.aud !== 'Sihatek Platform') {
            throw Errors.INVALID_TOKEN_PAYLOAD();
        }
        if (typeof decoded.id !== 'number' || !Number.isInteger(decoded.id) || decoded.id <= 0) {
            throw Errors.INVALID_TOKEN_PAYLOAD();
        }
        if (typeof decoded.sessionId !== 'number' || !Number.isInteger(decoded.sessionId) || decoded.sessionId <= 0) {
            throw Errors.INVALID_TOKEN_PAYLOAD();
        }
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            throw Errors.TOKEN_EXPIRED();
        }
        if (decoded.nbf && Date.now() < decoded.nbf * 1000) {
            throw Errors.INVALID_TOKEN_PAYLOAD();
        }

        const session = await AuthModel.findSession(decoded.sessionId);
        if (!session) {
            throw Errors.SESSION_NOT_FOUND();
        }

        const user = await AuthModel.findUserById(decoded.id);
        if (!user) {
            throw Errors.USER_NOT_FOUND();
        }
    
        req.user = user;
        req.session = session;
        next();
});


export const accountGuard = ({ verified = false , accepted = false , completed = false } = {}) => {
    return (req, res, next) => {
        const user = req.user;
        
        if (!user.is_active) {
            throw new AppError('Account is inactive', 403, 'ACCOUNT_INACTIVE');
        }
        if (verified && !user.is_verified) {
            throw new AppError('Email not verified', 403, 'EMAIL_NOT_VERIFIED');
        }
        if (accepted && !user.is_accepted) {
            throw new AppError('Account not accepted', 403, 'ACCOUNT_NOT_ACCEPTED');
        }
        if (completed && !user.is_completed) {
            throw new AppError('Profile not completed', 403, 'PROFILE_NOT_COMPLETED');
        }
        next();
    };
};
