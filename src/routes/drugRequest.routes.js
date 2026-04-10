import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// TODO: Import controllers
// const drugRequestController = require('../controllers/drugRequestController');

// Get all drug requests (admin)
router.get('/', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Get all drug requests
}));

// Get drug request by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  // Get specific drug request
}));

// Create drug request (patient)
router.post('/', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Create new drug request
}));

// Update drug request
router.patch('/:id', authenticate, asyncHandler(async (req, res) => {
  // Update drug request
}));

// Delete drug request
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  // Delete drug request
}));

// Update drug request status
router.patch('/:id/status', authenticate, asyncHandler(async (req, res) => {
  // Update drug request status (open, resolved)
}));

// Get pharmacy responses for drug request
router.get('/:id/responses', authenticate, asyncHandler(async (req, res) => {
  // Get all responses from pharmacies
}));

// Get open drug requests
router.get('/status/open', authenticate, asyncHandler(async (req, res) => {
  // Get all open drug requests
}));

// Get resolved drug requests
router.get('/status/resolved', authenticate, asyncHandler(async (req, res) => {
  // Get all resolved drug requests
}));

export default router;
