import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import * as pharmacyDashboardController from '../controllers/pharmacyDashboard.controller.js';

const router = Router();

// Public endpoints
router.get('/nearby', pharmacyDashboardController.getNearbyPharmaciesWithDrug);

// Pharmacist endpoints
router.get('/dashboard', authenticate, authorize(['pharmacist']), pharmacyDashboardController.getPharmacistDashboard);
router.post('/drug-requests/:id/respond', authenticate, authorize(['pharmacist']), pharmacyDashboardController.respondToDrugRequest);

// Patient endpoints - view pharmacy responses
router.get('/:id/pharmacy-responses', authenticate, pharmacyDashboardController.getPharmacyResponses);

export default router;
