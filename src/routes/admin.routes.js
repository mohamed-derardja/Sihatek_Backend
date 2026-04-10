import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize(['admin']));

// Doctor approval routes
router.get('/doctors/pending', adminController.getPendingDoctors);
router.patch('/doctors/:userId/accept', adminController.acceptDoctor);
router.patch('/doctors/:userId/reject', adminController.rejectDoctor);

// Pharmacy approval routes
router.get('/pharmacies/pending', adminController.getPendingPharmacies);
router.patch('/pharmacies/:userId/accept', adminController.acceptPharmacy);
router.patch('/pharmacies/:userId/reject', adminController.rejectPharmacy);

// Combined pending approvals
router.get('/approvals/pending', adminController.getPendingApprovals);

export default router;
