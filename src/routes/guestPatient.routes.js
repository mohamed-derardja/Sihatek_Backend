import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import * as guestPatientController from '../controllers/guestPatient.controller.js';

const router = Router();

// Doctor creates + manages their own guest patients
router.get('/', authenticate, authorize(['doctor', 'admin']), guestPatientController.listMyGuestPatients);
router.get('/:id', authenticate, authorize(['doctor', 'admin']), guestPatientController.getMyGuestPatientById);
router.post('/', authenticate, authorize(['doctor', 'admin']), guestPatientController.createMyGuestPatient);
router.patch('/:id', authenticate, authorize(['doctor', 'admin']), guestPatientController.updateMyGuestPatient);
router.delete('/:id', authenticate, authorize(['doctor', 'admin']), guestPatientController.deleteMyGuestPatient);

export default router;
