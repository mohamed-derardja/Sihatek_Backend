import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// TODO: Import controllers
// const inventoryController = require('../controllers/inventoryController');

// Get all inventory items (admin)
router.get('/', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Get all inventory items
}));

// Get inventory by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  // Get specific inventory item
}));

// Create inventory item
router.post('/', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Create new inventory item
}));

// Update inventory item
router.patch('/:id', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Update inventory item (quantity, price)
}));

// Delete inventory item
router.delete('/:id', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Delete inventory item
}));

// Get low stock items
router.get('/low-stock/list', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Get items with low stock
}));

// Update stock quantity
router.patch('/:id/stock', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Update stock quantity (add/subtract)
}));

export default router;
