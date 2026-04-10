import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// TODO: Import controllers
// const patientController = require('../controllers/patientController');

// Get all patients (admin)
router.get('/', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  // Get paginated list of patients
}));

// Get current patient profile
router.get('/profile', authenticate, authorize(['patient']), asyncHandler(async (req, res) => {
  // Get authenticated patient's profile
}));

// Get patient by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  // Get specific patient details
}));

// Create patient profile
router.post('/', authenticate, asyncHandler(async (req, res) => {
  // Create/register as patient
}));

// Update patient profile
router.patch('/:id', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Update patient profile
}));

// Delete patient profile
router.delete('/:id', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Delete patient profile
}));

// Get patient's allergies
router.get('/:id/allergies', authenticate, asyncHandler(async (req, res) => {
  // Get all allergies for patient
}));

// Add allergy to patient
router.post('/:id/allergies', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Add new allergy
}));

// Update allergy
router.patch('/:patientId/allergies/:allergyId', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Update allergy information
}));

// Delete allergy
router.delete('/:patientId/allergies/:allergyId', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Delete allergy
}));

// Get patient's medical conditions
router.get('/:id/medical-conditions', authenticate, asyncHandler(async (req, res) => {
  // Get all medical conditions
}));

// Add medical condition
router.post('/:id/medical-conditions', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Add new medical condition
}));

// Update medical condition
router.patch('/:patientId/medical-conditions/:conditionId', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Update medical condition
}));

// Delete medical condition
router.delete('/:patientId/medical-conditions/:conditionId', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Delete medical condition
}));

// Get patient's medications
router.get('/:id/medications', authenticate, asyncHandler(async (req, res) => {
  // Get all patient medications
}));

// Add medication to patient
router.post('/:id/medications', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Add medication to patient
}));

// Update patient medication
router.patch('/:patientId/medications/:medicationId', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Update patient medication
}));

// Delete patient medication
router.delete('/:patientId/medications/:medicationId', authenticate, authorize(['patient', 'doctor', 'admin']), asyncHandler(async (req, res) => {
  // Delete medication
}));

// Get patient's prescriptions
router.get('/:id/prescriptions', authenticate, authorize(['patient', 'doctor', 'pharmacist', 'admin']), asyncHandler(async (req, res) => {
  // Get all prescriptions for patient
}));

// Get patient's drug requests
router.get('/:id/drug-requests', authenticate, asyncHandler(async (req, res) => {
  // Get all drug requests
}));

// Create drug request
router.post('/:id/drug-requests', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Create new drug request
}));

// Update drug request
router.patch('/:patientId/drug-requests/:requestId', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Update drug request
}));

// Get patient's access codes
router.get('/:id/access-codes', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Get all access codes
}));

// Create access code
router.post('/:id/access-codes', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Create new access code
}));

// Revoke access code
router.delete('/:patientId/access-codes/:codeId', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Revoke access code
}));

// Get patient's access logs
router.get('/:id/access-logs', authenticate, authorize(['patient', 'admin']), asyncHandler(async (req, res) => {
  // Get access logs for patient
}));

module.exports = router;
