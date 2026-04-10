import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Get all users
router.get('/', userController.getAllUsers);

// Get current user profile
router.get('/profile', userController.getCurrentUserProfile);

// Search users
router.get('/search', userController.searchUsers);

// Get users by role
router.get('/role/:role', userController.getUsersByRole);

// Get user statistics
router.get('/stats', userController.getUserStatistics);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update current user profile
router.patch('/profile', userController.updateCurrentUserProfile);

// Update user by ID
router.patch('/:id', userController.updateUser);

// Delete current user account
router.delete('/profile', userController.deleteCurrentUserAccount);

// Delete user by ID
router.delete('/:id', userController.deleteUser);

// Update user role
router.patch('/:id/role', userController.updateUserRole);

// Update user status
router.patch('/:id/status', userController.updateUserStatus);

export default router;
