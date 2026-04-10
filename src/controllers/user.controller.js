import * as userModel from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Errors } from '../errors/errors.js';

// Get all users (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await userModel.getAllUsers(page, limit);

    res.status(200).json({
        success: true,
        code: 'USERS_RETRIEVED',
        message: 'Users retrieved successfully',
        data: result,
    });
});

// Get current user profile
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.getUserById(userId);
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    res.status(200).json({
        success: true,
        code: 'PROFILE_RETRIEVED',
        message: 'Profile retrieved successfully',
        data: { user },
    });
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await userModel.getUserById(parseInt(id));
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    res.status(200).json({
        success: true,
        code: 'USER_RETRIEVED',
        message: 'User retrieved successfully',
        data: { user },
    });
});

// Update current user profile
export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, phone, imageUrl, theme, lang } = req.body;

    // Validate theme
    if (theme && !['light', 'dark'].includes(theme)) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Validate language
    if (lang && !['en', 'ar', 'fr'].includes(lang)) {
        throw Errors.INVALID_PAYLOAD();
    }

    const user = await userModel.updateUser(userId, {
        name: name?.trim(),
        phone: phone?.trim(),
        imageUrl: imageUrl?.trim(),
        theme,
        lang,
    });

    res.status(200).json({
        success: true,
        code: 'PROFILE_UPDATED',
        message: 'Profile updated successfully',
        data: { user },
    });
});

// Update user by ID (admin only)
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, phone, imageUrl, theme, lang } = req.body;

    // Check if user exists
    const user = await userModel.getUserById(parseInt(id));
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    // Validate theme
    if (theme && !['light', 'dark'].includes(theme)) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Validate language
    if (lang && !['en', 'ar', 'fr'].includes(lang)) {
        throw Errors.INVALID_PAYLOAD();
    }

    const updatedUser = await userModel.updateUser(parseInt(id), {
        name: name?.trim(),
        phone: phone?.trim(),
        imageUrl: imageUrl?.trim(),
        theme,
        lang,
    });

    res.status(200).json({
        success: true,
        code: 'USER_UPDATED',
        message: 'User updated successfully',
        data: { user: updatedUser },
    });
});

// Delete user account (current user)
export const deleteCurrentUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await userModel.deleteUser(userId);

    res.status(200).json({
        success: true,
        code: 'ACCOUNT_DELETED',
        message: 'User account deleted successfully',
    });
});

// Delete user by ID (admin only)
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if user exists
    const user = await userModel.getUserById(parseInt(id));
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    await userModel.deleteUser(parseInt(id));

    res.status(200).json({
        success: true,
        code: 'USER_DELETED',
        message: 'User deleted successfully',
    });
});

// Update user role (admin only)
export const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['patient', 'doctor', 'pharmacist', 'admin'].includes(role)) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Check if user exists
    const user = await userModel.getUserById(parseInt(id));
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    const updatedUser = await userModel.updateUserRole(parseInt(id), role);

    res.status(200).json({
        success: true,
        code: 'ROLE_UPDATED',
        message: 'User role updated successfully',
        data: { user: updatedUser },
    });
});

// Update user status (admin only)
export const updateUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'active', 'rejected'].includes(status)) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Check if user exists
    const user = await userModel.getUserById(parseInt(id));
    if (!user) {
        throw Errors.USER_NOT_FOUND();
    }

    const updatedUser = await userModel.updateUserStatus(parseInt(id), status);

    res.status(200).json({
        success: true,
        code: 'STATUS_UPDATED',
        message: 'User status updated successfully',
        data: { user: updatedUser },
    });
});

// Search users (admin only)
export const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!query || query.trim().length < 2) {
        throw Errors.INVALID_PAYLOAD();
    }

    const result = await userModel.searchUsers(query.trim(), page, limit);

    res.status(200).json({
        success: true,
        code: 'USERS_SEARCH_SUCCESS',
        message: 'Users search completed',
        data: result,
    });
});

// Get users by role (admin only)
export const getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!['patient', 'doctor', 'pharmacist', 'admin'].includes(role)) {
        throw Errors.INVALID_PAYLOAD();
    }

    const result = await userModel.getUsersByRole(role, page, limit);

    res.status(200).json({
        success: true,
        code: 'USERS_RETRIEVED',
        message: 'Users retrieved by role successfully',
        data: result,
    });
});

// Get user statistics (admin only)
export const getUserStatistics = asyncHandler(async (req, res) => {
    const totalUsers = await userModel.getAllUsers(1, 1);
    const roleStats = await userModel.getUserCountByRole();

    res.status(200).json({
        success: true,
        code: 'STATS_RETRIEVED',
        message: 'User statistics retrieved successfully',
        data: {
            totalUsers: totalUsers.total,
            byRole: roleStats,
        },
    });
});
