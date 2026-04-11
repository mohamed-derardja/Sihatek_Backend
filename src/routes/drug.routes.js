import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import * as drugController from '../controllers/drug.controller.js';

const router = Router();

// Public routes
router.get('/', drugController.getAllDrugs);
router.get('/search', drugController.searchDrugs);
router.get('/:id', drugController.getDrugById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), drugController.createDrug);
router.patch('/:id', authenticate, authorize(['admin']), drugController.updateDrug);
router.delete('/:id', authenticate, authorize(['admin']), drugController.deleteDrug);

export default router;
