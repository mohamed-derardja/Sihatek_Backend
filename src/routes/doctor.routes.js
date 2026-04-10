import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// TODO: Import controllers
// const doctorController = require('../controllers/doctorController');

// Get all doctors
router.get('/', asyncHandler(async (req, res) => {
  // Get paginated list of doctors (public or filtered)
}));

// Get doctor by ID
router.get('/:id', asyncHandler(async (req, res) => {
  // Get specific doctor details
}));

// Create doctor profile (authenticated user)
router.post('/', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Create/register as doctor
}));

// Update doctor profile
router.patch('/:id', authenticate, authorize(['doctor', 'admin']), asyncHandler(async (req, res) => {
  // Update doctor profile
}));

// Delete doctor profile
router.delete('/:id', authenticate, authorize(['doctor', 'admin']), asyncHandler(async (req, res) => {
  // Delete doctor profile
}));

// Get doctor's prescriptions
router.get('/:id/prescriptions', authenticate, authorize(['doctor', 'admin']), asyncHandler(async (req, res) => {
  // Get doctor's issued prescriptions
}));

// Get doctors by specialization
router.get('/specialization/:specialization', asyncHandler(async (req, res) => {
  // Search doctors by specialization
}));

export default router;
