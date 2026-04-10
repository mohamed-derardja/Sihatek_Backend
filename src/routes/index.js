import authRoutes from './auth.routes.js';
import drugRoutes from './drug.routes.js';
import userRoutes from './user.routes.js';
import patientRoutes from './patient.routes.js';
import prescriptionRoutes from './prescription.routes.js';
import guestPatientRoutes from './guestPatient.routes.js';
import patientAccessRoutes from './patientAccess.routes.js';
import accessHistoryRoutes from './accessHistory.routes.js';
import pharmacyDashboardRoutes from './pharmacyDashboard.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';
import statisticsRoutes from './statistics.routes.js';
import settingsRoutes from './settings.routes.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const setupRoutes = (app) => {
    app.use('/api/auth/v1', authRoutes);
    app.use('/api/drugs/v1', drugRoutes);
    app.use('/api/users/v1', userRoutes);
    app.use('/api/patients/v1', patientRoutes);
    app.use('/api/patients/v1', accessHistoryRoutes);
    app.use('/api/prescriptions/v1', prescriptionRoutes);
    app.use('/api/guest-patients/v1', guestPatientRoutes);
    app.use('/api/patient-access/v1', patientAccessRoutes);
    app.use('/api/pharmacy/v1', pharmacyDashboardRoutes);
    app.use('/api/notifications/v1', notificationRoutes);
    app.use('/api/admin/v1', adminRoutes);
    app.use('/api/statistics/v1', statisticsRoutes);
    app.use('/api/settings/v1', settingsRoutes);

    app.get('/', (req, res) => {
        res.status(200).json({
            status: 'OK',
            message: 'Welcome to the Sihatek API',
            timestamp: new Date().toISOString(),
        });
    });

    // Health check route
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
        });
    });

    // 404 handler for undefined routes
    app.use((req, res) => {
        res.status(404).json({
            status: 'error',
            message: 'Route not found',
            path: req.path,
        });
    });

    // Error handling middleware
    app.use(errorHandler);
};


export default setupRoutes;
