import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as authModel from '../models/Auth.js';
import { Errors } from '../errors/errors.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

// Register user
export const registerUser = async (registerData) => {
    // Check if user already exists
    const existingUser = await authModel.findUserByEmail(registerData.email);
    if (existingUser) {
        throw Errors.USER_ALREADY_EXISTS();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // Create user
    const user = await authModel.createUser({
        name: registerData.name,
        email: registerData.email,
        password: hashedPassword,
        phone: registerData.phone,
        role: registerData.role || 'patient',
        provider: 'local',
    });

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    await authModel.createToken({
        token: hashedToken,
        type: 'verification',
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationToken,
    };
};

// Login user
export const loginUser = async (email, password, userAgent, ipAddress) => {
    // Find user
    const user = await authModel.findUserByEmail(email);
    if (!user || !user.password) {
        throw Errors.USER_NOT_FOUND();
    }

    // Check if user is verified
    if (!user.isVerified && user.provider === 'local') {
        throw Errors.EMAIL_NOT_VERIFIED();
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw Errors.INVALID_CREDENTIALS();
    }

    // Create session
    const session = await authModel.createSession({
        userId: user.id,
        refreshToken: generateRefreshToken({
            id: user.id,
        }),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: userAgent || 'Unknown',
        ipAddress: ipAddress || '127.0.0.1',
    });

    // Generate access token
    const accessToken = generateAccessToken({
        id: user.id,
        sessionId: session.id,
    });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
        },
        tokens: {
            accessToken,
            refreshToken: session.refresh_token,
        },
    };
};

// Login with Google
export const loginWithGoogle = async (googleToken, userAgent, ipAddress, role = 'patient') => {
    const { verifyGoogleToken } = await import('../utils/google.js');
    
    // Verify Google token
    const googlePayload = await verifyGoogleToken(googleToken);
    
    // Check if user exists
    let user = await authModel.findUserByEmail(googlePayload.email);
    
    if (!user) {
        // Create new user from Google data
        user = await authModel.createUser({
            name: `${googlePayload.firstName} ${googlePayload.lastName}`.trim(),
            email: googlePayload.email,
            phone: null,
            role: role || 'patient',
            provider: 'google',
            googleId: googlePayload.googleId,
            isVerified: true, // Google accounts are pre-verified
        });
    } else if (!user.googleId) {
        // Link Google account to existing user
        user = await authModel.updateUser(user.id, {
            googleId: googlePayload.googleId,
            provider: 'google',
            isVerified: true,
        });
    }
    
    // Create session
    const session = await authModel.createSession({
        userId: user.id,
        refreshToken: generateRefreshToken({
            id: user.id,
        }),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: userAgent || 'Unknown',
        ipAddress: ipAddress || '127.0.0.1',
    });
    
    // Generate access token
    const accessToken = generateAccessToken({
        id: user.id,
        sessionId: session.id,
    });
    
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            provider: user.provider,
        },
        tokens: {
            accessToken,
            refreshToken: session.refresh_token,
        },
    };
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
    try {
        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find session
        const session = await authModel.findSessionByRefreshToken(refreshToken);
        if (!session || (session.expiresAt && new Date() > session.expiresAt)) {
            throw Errors.SESSION_NOT_FOUND();
        }

        // Find user
        const user = await authModel.findUserById(decoded.id);
        if (!user) {
            throw Errors.USER_NOT_FOUND();
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({
            id: user.id,
            sessionId: session.id,
        });

        return {
            accessToken: newAccessToken,
        };
    } catch (error) {
        throw Errors.INVALID_TOKEN();
    }
};

// Verify email
export const verifyEmail = async (token) => {
    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find token
    const tokenRecord = await authModel.findToken(hashedToken);
    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
        throw Errors.TOKEN_EXPIRED();
    }

    // Check if user is already verified
    const user = await authModel.findUserById(tokenRecord.user_id);
    if (user && user.isVerified) {
        throw Errors.ALREADY_VERIFIED();
    }

    // Update user
    await authModel.updateUser(tokenRecord.user_id, {
        isVerified: true,
    });

    // Delete token
    await authModel.deleteToken(tokenRecord.id);

    return true;
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
    // Check if user exists
    const user = await authModel.findUserByEmail(email);
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    // Check if already verified
    if (user.isVerified) {
        throw Errors.ALREADY_VERIFIED();
    }

    // Create new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    await authModel.createToken({
        token: hashedToken,
        type: 'verification',
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return {
        email: user.email,
        verificationToken,
    };
};

// Logout user
export const logoutUser = async (sessionId) => {
    await authModel.deleteSession(sessionId);
    return true;
};

// Forgot password
export const forgotPassword = async (email) => {
    const user = await authModel.findUserByEmail(email);
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await authModel.createToken({
        token: hashedToken,
        type: 'password_reset',
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    return resetToken;
};

// Reset password
export const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await authModel.findToken(hashedToken);
    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
        throw Errors.TOKEN_EXPIRED();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await authModel.updateUser(tokenRecord.user_id, {
        password: hashedPassword,
    });

    await authModel.deleteToken(tokenRecord.id);

    return true;
};
