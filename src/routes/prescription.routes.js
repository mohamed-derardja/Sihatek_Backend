import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import * as prescriptionController from '../controllers/prescription.controller.js';

const router = Router();

// Doctor can create prescription
router.post('/', authenticate, authorize(['doctor']), prescriptionController.createPrescription);

// Doctor: prescriptions created by him
router.get('/me/doctor', authenticate, authorize(['doctor']), prescriptionController.getMyDoctorPrescriptions);

// Patient: all his prescriptions
router.get('/me/patient', authenticate, authorize(['patient']), prescriptionController.getMyPatientPrescriptions);

// Patient: generate access code to share prescriptions
router.post('/access-code', authenticate, authorize(['patient']), prescriptionController.createAccessCode);

// Doctor/Pharmacist: all prescriptions of a patient (requires accessCode)
router.get(
    '/patient/:patientId',
    authenticate,
    authorize(['doctor', 'pharmacist']),
    prescriptionController.getPatientPrescriptionsWithAccess,
);

// Get prescription by ID (access rules depend on role; doctor/pharmacist can use ?accessCode=... when needed)
router.get('/:id', authenticate, authorize(['doctor', 'patient', 'pharmacist']), prescriptionController.getPrescriptionById);

// Pharmacist: change status (requires ?accessCode=...)
router.patch(
    '/:id/status',
    authenticate,
    authorize(['pharmacist']),
    prescriptionController.updatePrescriptionStatus,
);

export default router;
