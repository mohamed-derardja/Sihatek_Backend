import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Errors } from '../errors/errors.js';
import { ENV } from '../config/env.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.sender.js';
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
    const { name, email, password, phone, nin } = req.body;

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
        nin,
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
    const { name, email, password, phone, specialization, licenseNumber, experienceYears, certificateUrl, clinicAddress } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !specialization || !licenseNumber) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Register user
    const result = await authService.registerUser({
        name,
        email,
        password,
        phone,
        role: 'doctor',
        doctorData: {
            specialization,
            licenseNumber,
            experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
            certificateUrl,
            clinicAddress,
        },
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
    const { name, email, password, phone, pharmacyName, licenseNumber, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !pharmacyName || !licenseNumber) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Register user
    const result = await authService.registerUser({
        name,
        email,
        password,
        phone,
        role: 'pharmacist',
        pharmacistData: {
            pharmacyName,
            licenseNumber,
            location,
        },
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
        throw Errors.INVALID_PAYLOAD();
    }

    const resetToken = await authService.forgotPassword(email);

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
        success: true,
        code: 'PASSWORD_RESET_EMAIL_SENT',
        message: 'Password reset email sent successfully',
    });
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        throw Errors.INVALID_TOKEN_FORMAT();
    }

    await authService.resetPassword(token, password);

    res.status(200).json({
        success: true,
        code: 'PASSWORD_RESET_SUCCESS',
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
    // Return only essential user info
    res.status(200).json({
        success: true,
        data: {
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
            },
        },
    });
});

// Get all user sessions
export const getUserSessions = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const sessions = await authService.getUserSessions(userId);

    res.status(200).json({
        success: true,
        code: 'SESSIONS_RETRIEVED',
        message: 'User sessions retrieved successfully',
        data: {
            sessions: sessions,
            total: sessions.length,
        },
    });
});

// Logout from specific session
export const logoutFromSession = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { sessionId } = req.params;

    if (!sessionId) {
        throw Errors.INVALID_PAYLOAD();
    }

    await authService.logoutFromSession(userId, parseInt(sessionId));

    res.status(200).json({
        success: true,
        code: 'SESSION_LOGOUT_SUCCESS',
        message: 'Logged out from session successfully',
    });
});

// Logout from all sessions
export const logoutFromAllSessions = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await authService.logoutFromAllSessions(userId);

    // Clear cookies after logging out from all sessions
    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        code: 'ALL_SESSIONS_LOGOUT_SUCCESS',
        message: 'Logged out from all sessions successfully',
    });
});
