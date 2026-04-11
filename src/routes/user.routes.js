import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Get all users (public, can search)
router.get('/', userController.getAllUsers);

// Get current user profile
router.get('/profile', authenticate, userController.getCurrentUserProfile);

// Search users
router.get('/search', authenticate, userController.searchUsers);

// Get users by role
router.get('/role/:role', authenticate, userController.getUsersByRole);

// Get user statistics
router.get('/stats', authenticate, userController.getUserStatistics);

// Get user by ID
router.get('/:id', authenticate, userController.getUserById);

// Update current user profile
router.patch('/profile', authenticate, userController.updateCurrentUserProfile);

// Update user by ID (admin only)
router.patch('/:id', authenticate, authorize(['admin']), userController.updateUser);

// Delete current user account
router.delete('/profile', authenticate, userController.deleteCurrentUserAccount);

// Delete user by ID (admin only)
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

// Update user role (admin only)
router.patch('/:id/role', authenticate, authorize(['admin']), userController.updateUserRole);

// Update user status (admin only)
router.patch('/:id/status', authenticate, authorize(['admin']), userController.updateUserStatus);

export default router;
