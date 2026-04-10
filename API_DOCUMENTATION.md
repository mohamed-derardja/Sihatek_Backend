# Complete API Documentation

## 📍 API Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://api.sihatek.com`

## 🔐 Authentication
All protected endpoints require JWT Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🚀 Quick Start Guide

### 1. API Documentation (Swagger)
Access the interactive API documentation:
```
GET http://localhost:5000/api-docs
```

Features:
- Full endpoint documentation
- Request/response examples
- Try-it-out functionality
- Authentication configuration

### 2. Health Check
```
GET http://localhost:5000/api/health
```

### 3. Welcome Endpoint
```
GET http://localhost:5000/
```

---

## 📚 Complete Endpoint Reference

### Authentication (`/api/auth/v1`)
- `POST /register-patient` - Register new patient
- `POST /register-doctor` - Register new doctor (pending approval)
- `POST /register-pharmacy` - Register new pharmacist (pending approval)
- `POST /login` - Login with email/password
- `POST /logout` - Logout and clear session

### User Profile (`/api/users/v1`)
- `GET /profile` - Get current user profile
- `PATCH /profile` - Update user profile (name, phone, theme, language)

### Patient Data Access Control (`/api/patient-access/v1`)
- `POST /requests` - Doctor requests access to patient data
- `GET /requests/my-sent` - List sent requests (doctor)
- `GET /requests/my-received` - List received requests (patient)
- `PATCH /requests/{id}` - Patient responds to request (approve/reject)
- `GET /grants` - List active grants (patient)
- `DELETE /grants/{doctorId}` - Revoke access grant (patient)

### Patient Access History (`/api/patients`)
- `GET /{id}/access-history` - Patient views access audit log
- `POST /{id}/block-access` - Patient blocks doctor access immediately

### Patient Data Endpoints (`/api/patients`)
- `GET /{id}/profile` - Get patient profile (requires profile scope)
- `GET /{id}/allergies` - Get allergies (requires allergies scope)
- `GET /{id}/medical-conditions` - Get medical conditions
- `GET /{id}/medications` - Get medications
- `GET /{id}/prescriptions` - Get prescriptions

### Pharmacy Features (`/api/pharmacy/v1`)
- `GET /nearby` - Find nearby pharmacies by location (public)
- `GET /dashboard` - Pharmacist dashboard with pending requests
- `POST /drug-requests/{id}/respond` - Respond to drug request with availability
- `GET /{id}/pharmacy-responses` - Patient views pharmacy responses

### Notifications (`/api/notifications/v1`)
- `GET /` - Get all notifications with stats
- `GET /unread-count` - Get unread notification count
- `PATCH /{id}/read` - Mark notification as read
- `PATCH /read-all` - Mark all notifications as read
- `DELETE /{id}` - Delete specific notification
- `DELETE /` - Delete all notifications

### Admin (`/api/admin/v1`)
- `GET /doctors/pending` - Get pending doctor registrations
- `PATCH /doctors/{id}/accept` - Approve doctor
- `PATCH /doctors/{id}/reject` - Reject doctor
- `GET /pharmacies/pending` - Get pending pharmacist registrations
- `PATCH /pharmacies/{id}/accept` - Approve pharmacist
- `PATCH /pharmacies/{id}/reject` - Reject pharmacist
- `GET /approvals` - Get all pending approvals

### Guest Patients (`/api/guest-patients/v1`)
- `POST /` - Create guest patient (doctor only)
- `GET /` - List guest patients

### Drugs (`/api/drugs/v1`)
- `GET /` - List all drugs with search/pagination
- `GET /{id}` - Get drug details

### Prescriptions (`/api/prescriptions/v1`)
- `POST /` - Create prescription (doctor only)
- `GET /` - List prescriptions

---

## 🔄 Common Workflows

### 1. Patient Registration & Login
```bash
# Register
POST /api/auth/v1/register-patient
{
  "name": "Ahmed Ali",
  "email": "patient@example.com",
  "password": "SecurePass123",
  "phone": "+201012345678"
}

# Login
POST /api/auth/v1/login
{
  "email": "patient@example.com",
  "password": "SecurePass123"
}
```

### 2. Request Data Access
```bash
# Doctor requests access
POST /api/patient-access/v1/requests
{
  "patientUserId": 5,
  "scopes": ["allergies", "medications", "prescriptions"],
  "durationDays": 30,
  "message": "Need to review for treatment plan"
}

# Patient approves
PATCH /api/patient-access/v1/requests/{requestId}
{
  "status": "approved",
  "durationDays": 30
}

# Doctor can now access
GET /api/patients/{patientId}/allergies
```

### 3. Find Pharmacy & Request Drug
```bash
# Find nearby pharmacies
GET /api/pharmacy/v1/nearby?latitude=30.0444&longitude=31.2357&radius=10

# Pharmacist responds to request
POST /api/pharmacy/v1/drug-requests/{drugRequestId}/respond
{
  "available": true,
  "responseText": "Available in 500mg dosage"
}

# Patient views responses
GET /api/pharmacy/v1/{patientId}/pharmacy-responses?available=true
```

### 4. Notification Handling
```bash
# Check unread count
GET /api/notifications/v1/unread-count

# Get notifications
GET /api/notifications/v1/?page=1&limit=20

# Mark as read
PATCH /api/notifications/v1/{notificationId}/read

# Mark all as read
PATCH /api/notifications/v1/read-all
```

---

## 🔒 Role-Based Access

| Endpoint | Patient | Doctor | Pharmacist | Admin |
|----------|---------|--------|-----------|-------|
| Register | ✓ | ✓ | ✓ | - |
| Login | ✓ | ✓ | ✓ | ✓ |
| Request access | - | ✓ | ✓ | - |
| Approve access | ✓ | - | - | - |
| View patient data | ✓ | ✓* | ✓* | ✓ |
| Access history | ✓ | - | - | - |
| Block access | ✓ | - | - | - |
| Pharmacy dashboard | - | - | ✓ | - |
| Respond to drugs | - | - | ✓ | - |
| Approve doctors | - | - | - | ✓ |
| Approve pharmacists | - | - | - | ✓ |

*With granted access/scopes

---

## 📊 Response Format

All endpoints return consistent JSON format:

**Success:**
```json
{
  "success": true,
  "code": "REQUEST_CODE",
  "message": "Human readable message",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "code": "ERROR_CODE"
  }
}
```

---

## 📝 Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden/Insufficient permissions |
| 404 | Not found |
| 500 | Server error |

---

## 🎯 Features Implemented

### Core Features
- ✅ User authentication (email/password)
- ✅ Role-based access control
- ✅ JWT token management
- ✅ User profile management

### Patient Data Access
- ✅ Request-based access control
- ✅ Time-limited access (expiry)
- ✅ Scope-based permissions (7 scopes)
- ✅ Access history audit log
- ✅ Immediate access blocking

### Pharmacy
- ✅ Geolocation-based pharmacy finder
- ✅ Pharmacist dashboard
- ✅ Drug request responses
- ✅ Availability tracking

### Notifications
- ✅ User notification system
- ✅ Read/unread tracking
- ✅ Pagination support
- ✅ Batch operations

### Admin
- ✅ Doctor approval workflow
- ✅ Pharmacist approval workflow
- ✅ Status management

---

## 📖 Documentation Files

1. **FEATURES_DOCUMENTATION.md** - Detailed feature descriptions
2. **NOTIFICATION_DOCUMENTATION.md** - Notification system guide
3. **swagger.yaml** - OpenAPI specification
4. **Interactive Docs** - `http://localhost:5000/api-docs`

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

5. **Access API:**
   - Docs: `http://localhost:5000/api-docs`
   - API: `http://localhost:5000`

---

## 💡 Tips

- Always include Authorization header for protected endpoints
- Use pagination for large datasets (page, limit)
- Check HTTP status codes for request validity
- Refer to swagger docs for all available parameters
- Test endpoints using Swagger UI before integration

---

## 📞 Support

For issues or questions:
- Email: support@sihatek.com
- GitHub: [Sihatek Backend](https://github.com/Abdelfatah10/Sihatek_Backend)

---

**Last Updated:** April 10, 2026
**API Version:** 1.0.0
**Status:** Production Ready ✅
