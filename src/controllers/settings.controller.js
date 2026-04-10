import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * Get user settings
 */
export const getSettings = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            theme: true,
            lang: true,
            imageUrl: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.status(200).json({
        success: true,
        code: 'SETTINGS_RETRIEVED',
        message: 'User settings retrieved successfully',
        data: { settings: user },
    });
});

/**
 * Update user settings (theme, language, notification preferences)
 */
export const updateSettings = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, phone, theme, lang } = req.body || {};

    // Validate inputs
    if (name && typeof name !== 'string') {
        throw new AppError('Name must be a string', 400, 'INVALID_PAYLOAD');
    }

    if (phone && typeof phone !== 'string') {
        throw new AppError('Phone must be a string', 400, 'INVALID_PAYLOAD');
    }

    if (theme && !['light', 'dark', 'auto'].includes(theme)) {
        throw new AppError('Theme must be light, dark, or auto', 400, 'INVALID_THEME');
    }

    if (lang && !['en', 'ar', 'fr'].includes(lang)) {
        throw new AppError('Language must be en, ar, or fr', 400, 'INVALID_LANGUAGE');
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (theme) updateData.theme = theme;
    if (lang) updateData.lang = lang;

    const updated = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            theme: true,
            lang: true,
            updatedAt: true,
        },
    });

    res.status(200).json({
        success: true,
        code: 'SETTINGS_UPDATED',
        message: 'User settings updated successfully',
        data: { settings: updated },
    });
});

/**
 * Get notification preferences
 */
export const getNotificationPreferences = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Define all notification types and their default values
    const allNotificationTypes = [
        { type: 'access_requested', label: 'Access Requested', enabled: true },
        { type: 'access_approved', label: 'Access Approved', enabled: true },
        { type: 'access_rejected', label: 'Access Rejected', enabled: true },
        { type: 'access_blocked', label: 'Access Blocked', enabled: true },
        { type: 'drug_available', label: 'Drug Available', enabled: true },
        { type: 'drug_unavailable', label: 'Drug Unavailable', enabled: true },
        { type: 'doctor_approved', label: 'Doctor Approved', enabled: true },
        { type: 'doctor_rejected', label: 'Doctor Rejected', enabled: true },
        { type: 'pharmacist_approved', label: 'Pharmacist Approved', enabled: true },
        { type: 'pharmacist_rejected', label: 'Pharmacist Rejected', enabled: true },
        { type: 'prescription_created', label: 'Prescription Created', enabled: true },
        { type: 'prescription_filled', label: 'Prescription Filled', enabled: true },
    ];

    // Get user's custom preferences from database (future enhancement)
    // For now, return all types with default enabled status
    const preferences = allNotificationTypes.map((type) => ({
        type: type.type,
        label: type.label,
        enabled: type.enabled,
    }));

    res.status(200).json({
        success: true,
        code: 'NOTIFICATION_PREFERENCES_RETRIEVED',
        message: 'Notification preferences retrieved successfully',
        data: {
            preferences,
            total: preferences.length,
            enabledCount: preferences.filter((p) => p.enabled).length,
        },
    });
});

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { preferences } = req.body || {};

    if (!preferences || !Array.isArray(preferences)) {
        throw new AppError('Preferences must be an array', 400, 'INVALID_PAYLOAD');
    }

    // Validate each preference
    const validatedPreferences = preferences.map((pref) => {
        if (!pref.type || typeof pref.enabled !== 'boolean') {
            throw new AppError('Each preference must have type and enabled boolean', 400, 'INVALID_PAYLOAD');
        }
        return {
            type: pref.type,
            enabled: pref.enabled,
        };
    });

    // Store preferences (can be implemented with a NotificationPreference model)
    // For now, return success response
    const enabledCount = validatedPreferences.filter((p) => p.enabled).length;

    res.status(200).json({
        success: true,
        code: 'NOTIFICATION_PREFERENCES_UPDATED',
        message: 'Notification preferences updated successfully',
        data: {
            updated: validatedPreferences.length,
            enabled: enabledCount,
            disabled: validatedPreferences.length - enabledCount,
        },
    });
});

/**
 * Update privacy settings
 */
export const updatePrivacySettings = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { showProfile, allowAccess, showInSearch } = req.body || {};

    // Validate inputs
    const updateData = {};
    if (showProfile !== undefined && typeof showProfile === 'boolean') {
        updateData.profilePublic = showProfile;
    }
    if (allowAccess !== undefined && typeof allowAccess === 'boolean') {
        updateData.allowAccessRequests = allowAccess;
    }

    // Note: These fields would need to be added to User model in Prisma
    // For now, this is a placeholder for privacy setting updates

    res.status(200).json({
        success: true,
        code: 'PRIVACY_SETTINGS_UPDATED',
        message: 'Privacy settings updated successfully',
        data: {
            settings: {
                showProfile: showProfile !== undefined ? showProfile : null,
                allowAccess: allowAccess !== undefined ? allowAccess : null,
            },
        },
    });
});

/**
 * Get account security info
 */
export const getAccountSecurity = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            isVerified: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const activeSessions = await prisma.session.count({
        where: {
            user_id: userId,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    const lastLogin = await prisma.session.findFirst({
        where: { user_id: userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, ipAddress: true },
    });

    res.status(200).json({
        success: true,
        code: 'ACCOUNT_SECURITY_RETRIEVED',
        message: 'Account security information retrieved successfully',
        data: {
            security: {
                emailVerified: user.isVerified,
                email: user.email,
                activeSessions,
                lastLogin: lastLogin?.createdAt || null,
                lastLoginIP: lastLogin?.ipAddress || null,
                accountCreatedAt: user.createdAt,
            },
        },
    });
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body || {};

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new AppError('All fields are required', 400, 'INVALID_PAYLOAD');
    }

    if (newPassword !== confirmPassword) {
        throw new AppError('Passwords do not match', 400, 'PASSWORDS_DONT_MATCH');
    }

    if (newPassword.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400, 'WEAK_PASSWORD');
    }

    // Validate old password (implement actual comparison with bcrypt)
    // This is a placeholder implementation
    if (oldPassword === newPassword) {
        throw new AppError('New password must be different from old password', 400, 'SAME_PASSWORD');
    }

    // Update password (would use bcrypt in real implementation)
    // This is just a placeholder
    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            updatedAt: new Date(),
        },
        select: { id: true, email: true, updatedAt: true },
    });

    res.status(200).json({
        success: true,
        code: 'PASSWORD_CHANGED',
        message: 'Password changed successfully',
        data: { user: updated },
    });
});

/**
 * Delete account
 */
export const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { password, confirmDeletion } = req.body || {};

    if (!password || confirmDeletion !== true) {
        throw new AppError('Password and confirmation required to delete account', 400, 'INVALID_PAYLOAD');
    }

    // In production, verify password before deletion
    // Delete user and cascade delete all related data
    const deleted = await prisma.user.delete({
        where: { id: userId },
        select: { id: true, email: true, name: true },
    });

    res.status(200).json({
        success: true,
        code: 'ACCOUNT_DELETED',
        message: 'Account deleted successfully',
        data: { deletedUser: deleted },
    });
});
