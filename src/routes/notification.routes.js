import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// TODO: Import controllers
// const notificationController = require('../controllers/notificationController');

// Get all notifications for user
router.get('/', authenticate, asyncHandler(async (req, res) => {
  // Get user's notifications
}));

// Get notification by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  // Get specific notification
}));

// Get unread notifications
router.get('/unread', authenticate, asyncHandler(async (req, res) => {
  // Get unread notifications for user
}));

// Get notifications by type
router.get('/type/:type', authenticate, asyncHandler(async (req, res) => {
  // Get notifications filtered by type
}));

// Mark notification as read
router.patch('/:id/read', authenticate, asyncHandler(async (req, res) => {
  // Mark notification as read
}));

// Mark all notifications as read
router.patch('/read-all', authenticate, asyncHandler(async (req, res) => {
  // Mark all notifications as read for user
}));

// Delete notification
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  // Delete notification
}));

// Delete all notifications
router.delete('/', authenticate, asyncHandler(async (req, res) => {
  // Delete all notifications for user
}));

export default router;
