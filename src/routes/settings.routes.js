import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as settingsController from '../controllers/settings.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user settings
router.get('/', settingsController.getSettings);

// Update user settings (name, phone, theme, language)
router.patch('/', settingsController.updateSettings);

// Notification preferences
router.get('/notifications', settingsController.getNotificationPreferences);
router.patch('/notifications', settingsController.updateNotificationPreferences);

// Privacy settings
router.patch('/privacy', settingsController.updatePrivacySettings);

// Account security
router.get('/security', settingsController.getAccountSecurity);

// Change password
router.post('/change-password', settingsController.changePassword);

// Delete account
router.post('/delete-account', settingsController.deleteAccount);

export default router;
