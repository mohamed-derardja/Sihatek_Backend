import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { Errors } from '../errors/errors.js';


const JWT_ACCESS_SECRET = ENV.jwtAccessSecret;
const JWT_REFRESH_SECRET = ENV.jwtRefreshSecret;

const JWT_EXPIRES_IN_ACCESS = ENV.jwtExpiresInAccess;
const JWT_EXPIRES_IN_REFRESH = ENV.jwtExpiresInRefresh;

// Access Token Functions
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_EXPIRES_IN_ACCESS,
        issuer: 'Sihatek', 
        audience: 'Sihatek Platform' 
    });
};

export const verifyAccessToken = (token) => {
    if (!token) {
        throw Errors.NO_TOKEN();
    }
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET, { 
            algorithms: ['HS256'],
            issuer: 'Sihatek', 
            audience: 'Sihatek Platform' 
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw Errors.TOKEN_EXPIRED();
        }
        throw Errors.INVALID_TOKEN();
    }
};

// Refresh Token Functions
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { 
        expiresIn: JWT_EXPIRES_IN_REFRESH, 
        issuer: 'Sihatek', 
        audience: 'Sihatek Platform' 
    });
};

export const verifyRefreshToken = (token) => {
    if (!token) {
        throw Errors.NO_TOKEN();
    }
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET, { 
            algorithms: ['HS256'],
            issuer: 'Sihatek', 
            audience: 'Sihatek Platform' 
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw Errors.TOKEN_EXPIRED();
        }
        throw Errors.INVALID_TOKEN();
    }
};


// Cookie Management Functions
export const setAuthCookies = (res, accessToken, refreshToken) => {
    const cookieOptions = {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: ENV.NODE_ENV === 'production',
    };
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const clearAuthCookies = (res) => {
    const cookieOptions = {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: ENV.NODE_ENV === 'production',
        maxAge: 0,
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
};
