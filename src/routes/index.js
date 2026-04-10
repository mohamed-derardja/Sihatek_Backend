import authRoutes from './auth.routes.js';
// import userRoutes from './user.routes.js';
// import doctorRoutes from './doctor.routes.js';
// import patientRoutes from './patient.routes.js';
// import pharmacistRoutes from './pharmacist.routes.js';
// import prescriptionRoutes from './prescription.routes.js';
// import drugRoutes from './drug.routes.js';
// import guestPatientRoutes from './guestPatient.routes.js';
// import inventoryRoutes from './inventory.routes.js';
// import accessCodeRoutes from './accessCode.routes.js';
// import accessLogRoutes from './accessLog.routes.js';
// import auditLogRoutes from './auditLog.routes.js';
// import drugRequestRoutes from './drugRequest.routes.js';
// import notificationRoutes from './notification.routes.js';

import { errorHandler } from '../middlewares/error.middleware.js';

const setupRoutes = (app) => {
    app.use('/api/auth/v1', authRoutes);
    // app.use('/api/users/v1', userRoutes);
    // app.use('/api/doctors/v1', doctorRoutes);
    // app.use('/api/patients/v1', patientRoutes);
    // app.use('/api/pharmacists/v1', pharmacistRoutes);
    // app.use('/api/prescriptions/v1', prescriptionRoutes);
    // app.use('/api/drugs/v1', drugRoutes);
    // app.use('/api/guest-patients/v1', guestPatientRoutes);
    // app.use('/api/inventory/v1', inventoryRoutes);
    // app.use('/api/access-codes/v1', accessCodeRoutes);
    // app.use('/api/access-logs/v1', accessLogRoutes);
    // app.use('/api/audit-logs/v1', auditLogRoutes);
    // app.use('/api/drug-requests/v1', drugRequestRoutes);
    // app.use('/api/notifications/v1', notificationRoutes);

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
