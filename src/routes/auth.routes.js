import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// Public routes
router.post('/register/patient', authController.registerPatient);

router.post('/register/doctor', authController.registerDoctor);

router.post('/register/pharmacy', authController.registerPharmacy);

router.post('/login', authController.login);

router.post('/google-auth', authController.googleAuth);

router.post('/verify-email', authController.verifyEmail);

router.post('/resend-verification', authController.resendVerification);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);

router.get('/me', authenticate, authController.getCurrentUser);

export default router;
