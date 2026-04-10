import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Errors } from '../errors/errors.js';
import { ENV } from '../config/env.js';
import { sendVerificationEmail } from '../utils/email.sender.js';
import { setAuthCookies, clearAuthCookies } from '../utils/jwt.js';

// Cookie configuration for secure token storage
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
};

// Register patient
export const registerPatient = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Register user
    const result = await authService.registerUser({
        name,
        email,
        password,
        phone,
        role: 'patient',
    });

    // send verification email
    await sendVerificationEmail(result.email, result.verificationToken);

    res.status(201).json({
        success: true,
        message: 'Patient registered successfully. Please verify your email.',
        data: {
            userId: result.id,
            email: result.email,
        },
    });
});

// Register doctor
export const registerDoctor = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Register user
    const result = await authService.registerUser({
        name,
        email,
        password,
        phone,
        role: 'doctor',
    });

    res.status(201).json({
        success: true,
        message: 'Doctor registered successfully. Please verify your email.',
        data: {
            userId: result.id,
            email: result.email,
        },
    });
});

// Register pharmacy
export const registerPharmacy = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Register user
    const result = await authService.registerUser({
        name,
        email,
        password,
        phone,
        role: 'pharmacist',
    });

    res.status(201).json({
        success: true,
        message: 'Pharmacy registered successfully. Please verify your email.',
        data: {
            userId: result.id,
            email: result.email,
        },
    });
});

// Login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Get user agent and IP address
    const userAgent = req.get('user-agent') || 'Unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';

    // Authenticate user
    const result = await authService.loginUser(email, password, userAgent, ipAddress);

    // Set cookies
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    res.status(200).json({
        success: true,
        code: 'LOGIN_SUCCESS',
        message: 'Logged in successfully',
        data: {
            user: result.user,
        },
    });
});

// Google Authentication
export const googleAuth = asyncHandler(async (req, res) => {
    const { token } = req.body;

    // Validate token
    if (!token) {
        throw Errors.MISSING_GOOGLE_TOKEN();
    }

    // Get user agent and IP address
    const userAgent = req.get('user-agent') || 'Unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';

    // Verify and authenticate with Google
    const result = await authService.loginWithGoogle(token, userAgent, ipAddress);

    // Set cookies
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    res.status(200).json({
        success: true,
        code: 'LOGIN_SUCCESS',
        message: 'Logged in with Google successfully',
        data: {
            user: result.user,
            tokens: result.tokens,
        },
    });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    // Logout user
    await authService.logoutUser(sessionId || req.session?.id);

    // Clear cookies
    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        code: 'LOGOUT_SUCCESS',
        message: 'Logged out successfully',
    });
});

// Verify email
export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        throw Errors.NO_TOKEN();
    }

    await authService.verifyEmail(token);

    res.status(200).json({
        success: true,
        code: 'EMAIL_VERIFIED',
        message: 'Email verified successfully',
    });
});

// Resend verification email
export const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Resend verification email
    const result = await authService.resendVerificationEmail(email);

    // Send verification email
    await sendVerificationEmail(result.email, result.verificationToken);

    res.status(200).json({
        success: true,
        code: 'VERIFICATION_EMAIL_SENT',
        message: 'Verification email sent successfully',
        data: {
            email: result.email,
        },
    });
});

// Forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw Errors.INVALID_TOKEN_FORMAT();
    }

    const resetToken = await authService.forgotPassword(email);

    res.status(200).json({
        success: true,
        message: 'Password reset email sent',
        data: {
            resetToken, // In production, send this via email, not in response
        },
    });
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
        throw Errors.INVALID_TOKEN_FORMAT();
    }

    if (password !== confirmPassword) {
        throw Errors.INVALID_TOKEN_PAYLOAD();
    }

    await authService.resetPassword(token, password);

    res.status(200).json({
        success: true,
        message: 'Password reset successfully',
    });
});

// Refresh token
export const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
        throw Errors.NO_TOKEN();
    }

    const result = await authService.refreshAccessToken(token);

    // Set new cookies
    res.cookie('accessToken', result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
            accessToken: result.accessToken,
            sessionId: result.sessionId,
        },
    });
});

// Get current user (protected route)
export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // User info is already in req.user from middleware
    res.status(200).json({
        success: true,
        data: {
            user: req.user,
        },
    });
});
