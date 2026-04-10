import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// TODO: Import controllers
// const pharmacistController = require('../controllers/pharmacistController');

// Get all pharmacists
router.get('/', asyncHandler(async (req, res) => {
  // Get paginated list of pharmacists
}));

// Get pharmacist by ID
router.get('/:id', asyncHandler(async (req, res) => {
  // Get specific pharmacist details
}));

// Create pharmacist profile
router.post('/', authenticate, asyncHandler(async (req, res) => {
  // Create/register as pharmacist
}));

// Update pharmacist profile
router.patch('/:id', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Update pharmacist profile
}));

// Delete pharmacist profile
router.delete('/:id', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Delete pharmacist profile
}));

// Get pharmacist's inventory
router.get('/:id/inventory', asyncHandler(async (req, res) => {
  // Get pharmacy inventory
}));

// Add drug to inventory
router.post('/:id/inventory', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Add drug to inventory
}));

// Update inventory item
router.patch('/:id/inventory/:itemId', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Update inventory item
}));

// Remove drug from inventory
router.delete('/:id/inventory/:itemId', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Remove drug from inventory
}));

// Get pharmacist's prescriptions
router.get('/:id/prescriptions', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Get all prescriptions for pharmacy
}));

// Get pharmacy responses
router.get('/:id/responses', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Get pharmacy responses to drug requests
}));

// Add response to drug request
router.post('/:id/responses', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Add response to drug request
}));

// Update pharmacy response
router.patch('/:id/responses/:responseId', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Update response
}));

// Delete pharmacy response
router.delete('/:id/responses/:responseId', authenticate, authorize(['pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Delete response
}));

// Search pharmacies by location
router.get('/location/:city', asyncHandler(async (req, res) => {
  // Search pharmacies by city
}));

export default router;
