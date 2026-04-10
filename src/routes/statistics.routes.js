import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as statisticsController from '../controllers/statistics.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get overview dashboard
router.get('/overview', statisticsController.getOverview);

// Get detailed statistics
router.get('/detailed', statisticsController.getDetailedStats);

export default router;
