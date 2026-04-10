import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as patientController from '../controllers/patient.controller.js';

const router = Router();

// Scope-protected read endpoints
router.get('/:id/profile', authenticate, patientController.getPatientProfile);
router.get('/:id/allergies', authenticate, patientController.getPatientAllergies);
router.get('/:id/medical-conditions', authenticate, patientController.getPatientMedicalConditions);
router.get('/:id/medications', authenticate, patientController.getPatientMedications);
router.get('/:id/prescriptions', authenticate, patientController.getPatientPrescriptions);

export default router;
