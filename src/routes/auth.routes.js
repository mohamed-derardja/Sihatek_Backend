import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// TODO: Import controllers
// const authController = require('../controllers/authController');

// Public routes
router.post('/register', asyncHandler(async (req, res) => {
  // Register user
}));

router.post('/login', asyncHandler(async (req, res) => {
  // User login
}));

router.post('/verify-email', asyncHandler(async (req, res) => {
  // Verify email with token
}));

router.post('/forgot-password', asyncHandler(async (req, res) => {
  // Request password reset
}));

router.post('/reset-password', asyncHandler(async (req, res) => {
  // Reset password with token
}));

router.post('/refresh-token', asyncHandler(async (req, res) => {
  // Refresh access token
}));

// Protected routes
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  // User logout
}));

router.post('/google-auth', asyncHandler(async (req, res) => {
  // Google OAuth authentication
}));

export default router;
