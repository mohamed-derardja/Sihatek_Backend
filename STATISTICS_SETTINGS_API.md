# Statistics & Settings API Documentation

## Overview

The Statistics and Settings endpoints provide role-based dashboards and user preferences management for all users in the Sihatek system.

---

## 📊 Statistics Endpoints (`/api/statistics/v1`)

### 1. Get Dashboard Overview
Returns comprehensive statistics based on user role.

**Endpoint:** `GET /api/statistics/v1/overview`

**Authorization:** Required (all authenticated users)

**Response Examples:**

#### Patient Overview
```json
{
  "success": true,
  "code": "OVERVIEW_RETRIEVED",
  "data": {
    "stats": {
      "role": "patient",
      "accessRequests": {
        "pending": 2,
        "active": 5
      },
      "prescriptions": 12,
      "medicalData": {
        "allergies": 3,
        "medications": 4
      },
      "notifications": {
        "total": 45,
        "unread": 7
      }
    }
  }
}
```

#### Doctor Overview
```json
{
  "success": true,
  "code": "OVERVIEW_RETRIEVED",
  "data": {
    "stats": {
      "role": "doctor",
      "accessRequests": {
        "total": 25,
        "pending": 3,
        "approved": 22,
        "activeGrants": 20
      },
      "prescriptions": 87,
      "notifications": {
        "total": 120,
        "unread": 15
      }
    }
  }
}
```

#### Pharmacist Overview
```json
{
  "success": true,
  "code": "OVERVIEW_RETRIEVED",
  "data": {
    "stats": {
      "role": "pharmacist",
      "drugRequests": {
        "total": 156,
        "pending": 12
      },
      "responses": 144,
      "prescriptionFills": 89,
      "notifications": {
        "total": 200,
        "unread": 25
      }
    }
  }
}
```

#### Admin Overview
```json
{
  "success": true,
  "code": "OVERVIEW_RETRIEVED",
  "data": {
    "stats": {
      "role": "admin",
      "users": {
        "total": 512,
        "patients": 400,
        "doctors": {
          "total": 75,
          "active": 70,
          "pending": 5
        },
        "pharmacists": {
          "total": 37,
          "active": 35,
          "pending": 2
        }
      },
      "sessions": 234,
      "notifications": 5432,
      "approvalsPending": 7
    }
  }
}
```

---

### 2. Get Detailed Statistics
Returns comprehensive detailed information including breakdowns and recent activities.

**Endpoint:** `GET /api/statistics/v1/detailed`

**Authorization:** Required (all authenticated users)

**Response Examples:**

#### Patient Detailed Stats
```json
{
  "success": true,
  "code": "DETAILED_STATS_RETRIEVED",
  "data": {
    "stats": {
      "profile": {
        "name": "Ahmed Ali",
        "email": "patient@example.com",
        "dateOfBirth": "1990-05-15",
        "gender": "male"
      },
      "accessRequests": [
        { "status": "pending", "count": 2 },
        { "status": "approved", "count": 5 },
        { "status": "rejected", "count": 1 }
      ],
      "activeDocsWithAccess": [
        {
          "doctorId": 3,
          "name": "Dr. Fatima",
          "specialization": "Cardiologist",
          "grantedAt": "2026-03-15T10:00:00Z",
          "expiresAt": "2026-04-15T10:00:00Z"
        }
      ]
    }
  }
}
```

#### Doctor Detailed Stats
```json
{
  "success": true,
  "code": "DETAILED_STATS_RETRIEVED",
  "data": {
    "stats": {
      "profile": {
        "name": "Dr. Ahmed Hassan",
        "email": "doctor@example.com",
        "specialization": "Cardiologist",
        "clinicName": "Heart Care Center"
      },
      "accessRequests": [
        { "status": "pending", "count": 3 },
        { "status": "approved", "count": 22 }
      ],
      "recentPrescriptions": [
        {
          "id": 123,
          "patientName": "Hassan Mohammed",
          "medication": "Aspirin 5mg",
          "createdAt": "2026-04-10T14:30:00Z"
        }
      ]
    }
  }
}
```

#### Pharmacist Detailed Stats
```json
{
  "success": true,
  "code": "DETAILED_STATS_RETRIEVED",
  "data": {
    "stats": {
      "profile": {
        "name": "Amina Pharmacy",
        "email": "pharmacist@example.com",
        "pharmacyName": "Amina Health Pharmacy",
        "city": "Cairo"
      },
      "drugRequests": [
        { "status": "open", "count": 12 },
        { "status": "filled", "count": 144 }
      ],
      "recentResponses": [
        {
          "id": 456,
          "patientName": "Fatima Ali",
          "drugName": "Paracetamol",
          "available": true,
          "respondedAt": "2026-04-10T16:00:00Z"
        }
      ]
    }
  }
}
```

#### Admin Detailed Stats
```json
{
  "success": true,
  "code": "DETAILED_STATS_RETRIEVED",
  "data": {
    "stats": {
      "userStats": {
        "byRole": [
          { "role": "patient", "count": 400 },
          { "role": "doctor", "count": 75 },
          { "role": "pharmacist", "count": 37 }
        ],
        "byStatus": [
          { "status": "active", "count": 505 },
          { "status": "pending", "count": 7 }
        ]
      },
      "prescriptionStats": [
        { "status": "pending", "count": 45 },
        { "status": "filled", "count": 520 }
      ],
      "recentUsers": [
        {
          "id": 512,
          "name": "New User",
          "email": "newuser@example.com",
          "role": "patient",
          "status": "active",
          "createdAt": "2026-04-10T12:00:00Z"
        }
      ]
    }
  }
}
```

---

## ⚙️ Settings Endpoints (`/api/settings/v1`)

### 1. Get User Settings
Retrieve current user's settings.

**Endpoint:** `GET /api/settings/v1/`

**Authorization:** Required

**Response:**
```json
{
  "success": true,
  "code": "SETTINGS_RETRIEVED",
  "data": {
    "settings": {
      "id": 1,
      "name": "Ahmed Ali",
      "email": "user@example.com",
      "phone": "+201012345678",
      "theme": "dark",
      "lang": "en",
      "imageUrl": "https://...",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-04-10T10:00:00Z"
    }
  }
}
```

**Supported Fields:**
- `name` - User full name
- `email` - Email address (read-only)
- `phone` - Phone number
- `theme` - UI theme: `light`, `dark`, `auto`
- `lang` - Language: `en`, `ar`, `fr`
- `imageUrl` - Profile image URL (read-only)

---

### 2. Update User Settings
Update user preferences.

**Endpoint:** `PATCH /api/settings/v1/`

**Authorization:** Required

**Request Body:**
```json
{
  "name": "Ahmed Mohammed Ali",
  "phone": "+201112345678",
  "theme": "dark",
  "lang": "ar"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SETTINGS_UPDATED",
  "data": {
    "settings": {
      "id": 1,
      "name": "Ahmed Mohammed Ali",
      "phone": "+201112345678",
      "theme": "dark",
      "lang": "ar",
      "updatedAt": "2026-04-10T14:30:00Z"
    }
  }
}
```

**Valid Values:**
- `theme`: `light`, `dark`, `auto`
- `lang`: `en` (English), `ar` (Arabic), `fr` (French)

---

### 3. Get Notification Preferences
Retrieve notification preferences for all notification types.

**Endpoint:** `GET /api/settings/v1/notifications`

**Authorization:** Required

**Response:**
```json
{
  "success": true,
  "code": "NOTIFICATION_PREFERENCES_RETRIEVED",
  "data": {
    "preferences": [
      { "type": "access_requested", "label": "Access Requested", "enabled": true },
      { "type": "access_approved", "label": "Access Approved", "enabled": true },
      { "type": "access_rejected", "label": "Access Rejected", "enabled": true },
      { "type": "access_blocked", "label": "Access Blocked", "enabled": true },
      { "type": "drug_available", "label": "Drug Available", "enabled": true },
      { "type": "drug_unavailable", "label": "Drug Unavailable", "enabled": false },
      { "type": "doctor_approved", "label": "Doctor Approved", "enabled": true },
      { "type": "doctor_rejected", "label": "Doctor Rejected", "enabled": true },
      { "type": "pharmacist_approved", "label": "Pharmacist Approved", "enabled": true },
      { "type": "pharmacist_rejected", "label": "Pharmacist Rejected", "enabled": true },
      { "type": "prescription_created", "label": "Prescription Created", "enabled": true },
      { "type": "prescription_filled", "label": "Prescription Filled", "enabled": true }
    ],
    "total": 12,
    "enabledCount": 11
  }
}
```

**Notification Types:**
- `access_requested` - Doctor/Pharmacist requests access
- `access_approved` - Patient approves access
- `access_rejected` - Patient rejects access
- `access_blocked` - Patient blocks doctor access
- `drug_available` - Drug is available at pharmacy
- `drug_unavailable` - Drug is not available
- `doctor_approved` - Doctor registration approved
- `doctor_rejected` - Doctor registration rejected
- `pharmacist_approved` - Pharmacist registration approved
- `pharmacist_rejected` - Pharmacist registration rejected
- `prescription_created` - New prescription created
- `prescription_filled` - Prescription filled

---

### 4. Update Notification Preferences
Enable/disable specific notification types.

**Endpoint:** `PATCH /api/settings/v1/notifications`

**Authorization:** Required

**Request Body:**
```json
{
  "preferences": [
    { "type": "access_requested", "enabled": true },
    { "type": "drug_unavailable", "enabled": false },
    { "type": "access_blocked", "enabled": true }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "code": "NOTIFICATION_PREFERENCES_UPDATED",
  "data": {
    "updated": 3,
    "enabled": 2,
    "disabled": 1
  }
}
```

---

### 5. Update Privacy Settings
Update profile visibility and access permissions.

**Endpoint:** `PATCH /api/settings/v1/privacy`

**Authorization:** Required

**Request Body:**
```json
{
  "showProfile": true,
  "allowAccess": true
}
```

**Response:**
```json
{
  "success": true,
  "code": "PRIVACY_SETTINGS_UPDATED",
  "data": {
    "settings": {
      "showProfile": true,
      "allowAccess": true
    }
  }
}
```

**Options:**
- `showProfile` - Show profile to other users (boolean)
- `allowAccess` - Allow access requests from doctors (boolean)

---

### 6. Get Account Security Info
Retrieve security-related information.

**Endpoint:** `GET /api/settings/v1/security`

**Authorization:** Required

**Response:**
```json
{
  "success": true,
  "code": "ACCOUNT_SECURITY_RETRIEVED",
  "data": {
    "security": {
      "emailVerified": true,
      "email": "user@example.com",
      "activeSessions": 2,
      "lastLogin": "2026-04-10T14:30:00Z",
      "lastLoginIP": "192.168.1.1",
      "accountCreatedAt": "2026-01-15T08:00:00Z"
    }
  }
}
```

---

### 7. Change Password
Update user password with old password verification.

**Endpoint:** `POST /api/settings/v1/change-password`

**Authorization:** Required

**Request Body:**
```json
{
  "oldPassword": "CurrentPassword123",
  "newPassword": "NewSecurePassword456",
  "confirmPassword": "NewSecurePassword456"
}
```

**Response:**
```json
{
  "success": true,
  "code": "PASSWORD_CHANGED",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "updatedAt": "2026-04-10T14:35:00Z"
    }
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- New password must differ from old password
- Both passwords must match in request

---

### 8. Delete Account
Permanently delete user account and associated data.

**Endpoint:** `POST /api/settings/v1/delete-account`

**Authorization:** Required

**Request Body:**
```json
{
  "password": "UserPassword123",
  "confirmDeletion": true
}
```

**Response:**
```json
{
  "success": true,
  "code": "ACCOUNT_DELETED",
  "data": {
    "deletedUser": {
      "id": 1,
      "email": "user@example.com",
      "name": "Ahmed Ali"
    }
  }
}
```

**Warning:** This action is irreversible and will:
- Delete user account
- Delete all user data
- Revoke all access grants
- Delete all notifications

---

## 📋 Statistics by Role Summary

### Patient
- Access requests (pending, active)
- Prescriptions count
- Medical data (allergies, medications)
- Notifications (total, unread)

### Doctor
- Access requests (total, pending, approved, active)
- Prescriptions created
- Notifications (total, unread)
- Recent access and activity

### Pharmacist
- Drug requests (total, pending)
- Responses provided
- Prescriptions filled
- Recent activities

### Admin
- Total users by role
- User status breakdown
- Pending approvals
- System-wide statistics
- Recent registrations

---

## 🔐 Authentication & Authorization

**All Endpoints Require:**
- Valid JWT token in `Authorization: Bearer <token>` header
- User must be authenticated

**Role-Based Access:**
- All users see their own role-specific statistics
- Patients cannot see doctor statistics
- Non-admin users cannot see admin statistics
- Settings are user-specific

---

## ⚠️ Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `INVALID_PAYLOAD` | 400 | Request body format incorrect |
| `INVALID_THEME` | 400 | Theme value not valid |
| `INVALID_LANGUAGE` | 400 | Language value not valid |
| `PASSWORDS_DONT_MATCH` | 400 | Password confirmation mismatch |
| `WEAK_PASSWORD` | 400 | Password too short (min 8 chars) |
| `SAME_PASSWORD` | 400 | New password same as old |
| `USER_NOT_FOUND` | 404 | User account not found |
| `PATIENT_NOT_FOUND` | 404 | Patient profile not found |
| `DOCTOR_NOT_FOUND` | 404 | Doctor profile not found |
| `PHARMACIST_NOT_FOUND` | 404 | Pharmacist profile not found |

---

## 🚀 Usage Examples

### Get Patient Dashboard
```bash
curl -X GET http://localhost:5000/api/statistics/v1/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Theme Preference
```bash
curl -X PATCH http://localhost:5000/api/settings/v1/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "lang": "ar"}'
```

### Disable Specific Notifications
```bash
curl -X PATCH http://localhost:5000/api/settings/v1/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": [
      {"type": "drug_unavailable", "enabled": false},
      {"type": "access_blocked", "enabled": false}
    ]
  }'
```

---

## 📱 Frontend Integration

### React Example - Get Overview
```javascript
const getOverview = async (token) => {
  const response = await fetch('/api/statistics/v1/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Usage
const stats = await getOverview(userToken);
console.log(stats.data.stats.role);
```

### Update Settings
```javascript
const updateSettings = async (token, settings) => {
  const response = await fetch('/api/settings/v1/', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
  return response.json();
};

// Usage
await updateSettings(token, { theme: 'dark', lang: 'ar' });
```

---

**Last Updated**: April 11, 2026  
**Status**: ✅ Endpoints Active  
**Version**: 1.0.0
