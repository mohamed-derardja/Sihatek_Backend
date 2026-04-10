import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as patientAccessController from '../controllers/patientAccess.controller.js';

const router = Router();

router.post('/requests', authenticate, patientAccessController.createAccessRequest);
router.get('/requests/sent', authenticate, patientAccessController.listMySentRequests);
router.get('/requests/received', authenticate, patientAccessController.listMyReceivedRequests);
router.patch('/requests/:id', authenticate, patientAccessController.respondToRequest);

router.get('/grants', authenticate, patientAccessController.listMyGrants);
router.patch('/grants/:doctorId/revoke', authenticate, patientAccessController.revokeGrant);

export default router;
