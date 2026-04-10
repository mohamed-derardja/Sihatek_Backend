import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// TODO: Import controllers
// const guestPatientController = require('../controllers/guestPatientController');

// Get all guest patients (created by user)
router.get('/', authenticate, asyncHandler(async (req, res) => {
  // Get guest patients created by authenticated user
}));

// Get guest patient by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  // Get specific guest patient details
}));

// Create guest patient
router.post('/', authenticate, asyncHandler(async (req, res) => {
  // Create new guest patient
}));

// Update guest patient
router.patch('/:id', authenticate, asyncHandler(async (req, res) => {
  // Update guest patient information
}));

// Delete guest patient
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  // Delete guest patient
}));

// Get guest patient's medical conditions
router.get('/:id/medical-conditions', authenticate, asyncHandler(async (req, res) => {
  // Get guest patient's medical conditions
}));

// Add medical condition to guest patient
router.post('/:id/medical-conditions', authenticate, asyncHandler(async (req, res) => {
  // Add medical condition to guest patient
}));

// Update guest patient's medical condition
router.patch('/:guestPatientId/medical-conditions/:conditionId', authenticate, asyncHandler(async (req, res) => {
  // Update guest patient's medical condition
}));

// Delete guest patient's medical condition
router.delete('/:guestPatientId/medical-conditions/:conditionId', authenticate, asyncHandler(async (req, res) => {
  // Delete guest patient's medical condition
}));

// Get guest patient's prescriptions
router.get('/:id/prescriptions', authenticate, asyncHandler(async (req, res) => {
  // Get guest patient's prescriptions
}));

export default router;
