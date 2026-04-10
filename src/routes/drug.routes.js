import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// TODO: Import controllers
// const drugController = require('../controllers/drugController');

// Get all drugs
router.get('/', asyncHandler(async (req, res) => {
  // Get paginated list of drugs
}));

// Search drugs
router.get('/search', asyncHandler(async (req, res) => {
  // Search drugs by name
}));

// Get drug by ID
router.get('/:id', asyncHandler(async (req, res) => {
  // Get specific drug details
}));

// Create drug (admin)
router.post('/', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Create new drug
}));

// Update drug
router.patch('/:id', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Update drug information
}));

// Delete drug (admin)
router.delete('/:id', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Delete drug
}));

// Get drug availability
router.get('/:id/availability', asyncHandler(async (req, res) => {
  // Get drug availability in pharmacies
}));

export default router;
