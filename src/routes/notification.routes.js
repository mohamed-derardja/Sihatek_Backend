import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as notificationController from '../controllers/notification.controller.js';

const router = Router();

// Get all notifications for user (with pagination)
router.get('/', authenticate, notificationController.getUserNotifications);

// Get unread notifications count
router.get('/unread-count', authenticate, notificationController.getUnreadNotificationsCount);

// Mark notification as read
router.patch('/:id/read', authenticate, notificationController.markNotificationAsRead);

// Mark all notifications as read
router.patch('/read-all', authenticate, notificationController.markAllNotificationsAsRead);

// Delete notification
router.delete('/:id', authenticate, notificationController.deleteNotification);

// Delete all notifications
router.delete('', authenticate, notificationController.deleteAllNotifications);

export default router;
