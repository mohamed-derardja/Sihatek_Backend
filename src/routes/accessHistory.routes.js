import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as accessHistoryController from '../controllers/accessHistory.controller.js';

const router = Router();

// Patient access history endpoints
router.get('/:id/access-history', authenticate, accessHistoryController.getPatientAccessHistory);
router.post('/:id/block-access', authenticate, accessHistoryController.blockAccessToDoctor);

export default router;
