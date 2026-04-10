import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// TODO: Import controllers
// const accessCodeController = require('../controllers/accessCodeController');

// Get all access codes (admin)
router.get('/', authenticate, authorize(['admin']),
  // Get all access codes
);

// Get access code by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  // Get specific access code
}));

// Create access code
router.post('/', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Create new access code for patient
}));

// Validate access code
router.post('/validate/:code', asyncHandler(async (req, res) => {
  // Validate if access code is valid and not expired
}));

// Use access code
router.post('/:id/use', asyncHandler(async (req, res) => {
  // Mark access code as used
}));

// Revoke access code
router.delete('/:id', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Revoke access code
}));

// Get active codes for patient
router.get('/patient/:patientId/active', authenticate, asyncHandler(async (req, res) => {
  // Get active access codes for patient
}));

export default router;
