import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import * as patientAccessController from '../controllers/patientAccess.controller.js';

const router = Router();

// Doctor/Admin: Request access to patient data
router.post('/requests', authenticate, authorize(['doctor', 'admin']), patientAccessController.createAccessRequest);

// Doctor/Admin: View their sent access requests
router.get('/requests/sent', authenticate, authorize(['doctor', 'admin']), patientAccessController.listMySentRequests);

// Patient/Admin: View access requests they received
router.get('/requests/received', authenticate, authorize(['patient', 'admin']), patientAccessController.listMyReceivedRequests);

// Patient/Admin: Respond to access request (approve/reject)
router.patch('/requests/:id', authenticate, authorize(['patient', 'admin']), patientAccessController.respondToRequest);

// Patient/Admin: View active access grants
router.get('/grants', authenticate, authorize(['patient', 'admin']), patientAccessController.listMyGrants);

// Patient/Admin: Revoke access grant
router.patch('/grants/:doctorId/revoke', authenticate, authorize(['patient', 'admin']), patientAccessController.revokeGrant);

export default router;
