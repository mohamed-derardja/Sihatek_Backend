import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// TODO: Import controllers
// const prescriptionController = require('../controllers/prescriptionController');

// Get all prescriptions (admin)
router.get('/', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Get paginated list of prescriptions
}));

// Get prescription by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  // Get specific prescription details
}));

// Create prescription (doctor only)
router.post('/', authenticate, authorize(['doctor']), asyncHandler(async (req, res) => {
  // Create new prescription
}));

// Update prescription
router.patch('/:id', authenticate, authorize(['doctor', 'pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Update prescription
}));

// Delete prescription
router.delete('/:id', authenticate, authorize(['doctor', 'admin']), asyncHandler(async (req, res) => {
  // Delete prescription
}));

// Update prescription status
router.patch('/:id/status', authenticate, authorize(['doctor', 'pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Update prescription status (pending, approved, rejected)
}));

// Get prescription items
router.get('/:id/items', authenticate, asyncHandler(async (req, res) => {
  // Get all items in prescription
}));

// Add item to prescription
router.post('/:id/items', authenticate, authorize(['doctor', 'admin']), asyncHandler(async (req, res) => {
  // Add new item to prescription
}));

// Update prescription item
router.patch('/:prescriptionId/items/:itemId', authenticate, authorize(['doctor', 'admin']), asyncHandler(async (req, res) => {
  // Update prescription item
}));

// Remove item from prescription
router.delete('/:prescriptionId/items/:itemId', authenticate, authorize(['doctor', 'admin']), asyncHandler(async (req, res) => {
  // Remove item from prescription
}));

// Generate QR code for prescription
router.post('/:id/qrcode', authenticate, authorize(['doctor', 'pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Generate QR code for prescription
}));

// Verify prescription by QR code
router.post('/verify/:qrCode', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Verify prescription using QR code
}));

// Get prescriptions by status
router.get('/status/:status', authenticate, asyncHandler(async (req, res) => {
  // Get prescriptions filtered by status
}));

// Get expired prescriptions
router.get('/expired/list', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Get expired prescriptions
}));

export default router;
