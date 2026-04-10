import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import doctorRoutes from './doctor.routes.js';
import patientRoutes from './patient.routes.js';
import pharmacistRoutes from './pharmacist.routes.js';
import prescriptionRoutes from './prescription.routes.js';
import drugRoutes from './drug.routes.js';
import guestPatientRoutes from './guestPatient.routes.js';
import inventoryRoutes from './inventory.routes.js';
import accessCodeRoutes from './accessCode.routes.js';
import accessLogRoutes from './accessLog.routes.js';
import auditLogRoutes from './auditLog.routes.js';
import drugRequestRoutes from './drugRequest.routes.js';
import notificationRoutes from './notification.routes.js';

const setupRoutes = (app) => {
  // Mount all routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/doctors', doctorRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/pharmacists', pharmacistRoutes);
  app.use('/api/prescriptions', prescriptionRoutes);
  app.use('/api/drugs', drugRoutes);
  app.use('/api/guest-patients', guestPatientRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/access-codes', accessCodeRoutes);
  app.use('/api/access-logs', accessLogRoutes);
  app.use('/api/audit-logs', auditLogRoutes);
  app.use('/api/drug-requests', drugRequestRoutes);
  app.use('/api/notifications', notificationRoutes);

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
};

export default setupRoutes;
