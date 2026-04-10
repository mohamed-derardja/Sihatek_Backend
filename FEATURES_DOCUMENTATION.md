# New Features - Access History, Pharmacy Dashboard & Drug Availability

## ✅ Completed Features

### 1. **Patient Access History** 📊
Patients can now view a complete history of who accessed their medical data and when.

**Endpoint:**
```
GET /api/patients/:id/access-history?page=1&limit=20
```

**Authentication:** Required (Patient role)

**Response:**
```json
{
  "success": true,
  "code": "PATIENT_ACCESS_HISTORY_RETRIEVED",
  "data": {
    "accessLogs": [
      {
        "id": 1,
        "patientId": 5,
        "accessedById": 3,
        "role": "doctor",
        "accessType": "view",
        "timestamp": "2026-04-10T12:30:00Z",
        "accessedBy": {
          "id": 3,
          "name": "Dr. Ahmed",
          "email": "ahmed@hospital.com",
          "role": "doctor"
        }
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 15, "pages": 1 }
  }
}
```

---

### 2. **Block/Revoke Access** 🚫
Patients can immediately revoke access granted to doctors at any time.

**Endpoint:**
```
POST /api/patients/:id/block-access
```

**Request Body:**
```json
{
  "doctorId": 2
}
```

**Authentication:** Required (Patient role)

**Response:**
```json
{
  "success": true,
  "code": "ACCESS_BLOCKED",
  "message": "Access to this doctor has been blocked successfully",
  "data": {
    "grant": {
      "id": 1,
      "patientId": 5,
      "doctorId": 2,
      "scopes": ["profile", "allergies"],
      "isActive": false,
      "expiresAt": null,
      "doctor": {
        "id": 2,
        "user": { "name": "Dr. Ahmed", "email": "ahmed@hospital.com" }
      }
    }
  }
}
```

---

### 3. **Nearby Pharmacies Finder** 📍
Find pharmacies near a location using geolocation (latitude, longitude).

**Endpoint:**
```
GET /api/pharmacy/v1/nearby?latitude=30.0444&longitude=31.2357&radius=10
```

**Query Parameters:**
- `latitude` (required): Patient's latitude
- `longitude` (required): Patient's longitude
- `radius` (optional, default: 10): Search radius in kilometers
- `drugName` (optional): Filter by drug name

**Authentication:** Not required (Public)

**Response:**
```json
{
  "success": true,
  "code": "NEARBY_PHARMACIES_RETRIEVED",
  "message": "Found 5 pharmacies within 10km",
  "data": {
    "pharmacies": [
      {
        "id": 1,
        "userId": 10,
        "pharmacyName": "Al-Noor Pharmacy",
        "licenseNumber": "PH-001",
        "location": "Cairo, Egypt",
        "city": "Cairo",
        "latitude": 30.0444,
        "longitude": 31.2357,
        "distance": 2.5,
        "user": {
          "id": 10,
          "name": "Pharmacy Manager",
          "email": "manager@noor.com",
          "phone": "+201012345678"
        }
      }
    ]
  }
}
```

---

### 4. **Pharmacist Dashboard** 💊
Pharmacists see all drug requests from patients and can respond with availability status.

**Endpoint:**
```
GET /api/pharmacy/v1/dashboard
```

**Authentication:** Required (Pharmacist role)

**Response:**
```json
{
  "success": true,
  "code": "PHARMACIST_DASHBOARD_RETRIEVED",
  "message": "Pharmacist dashboard retrieved successfully",
  "data": {
    "stats": {
      "totalDrugRequests": 25,
      "respondedCount": 18,
      "pendingCount": 7
    },
    "drugRequests": [
      {
        "id": 1,
        "patientId": 5,
        "drugId": 100,
        "status": "open",
        "patient": {
          "id": 5,
          "user": {
            "id": 5,
            "name": "Ahmed",
            "email": "patient@email.com"
          }
        },
        "drug": {
          "id": 100,
          "name": "Aspirin",
          "manufacturer": "Bayer",
          "description": "Pain reliever"
        },
        "myResponse": null,
        "hasResponded": false
      }
    ]
  }
}
```

---

### 5. **Respond to Drug Request** ✅
Pharmacists respond to drug requests indicating availability.

**Endpoint:**
```
POST /api/pharmacy/v1/drug-requests/:id/respond
```

**Request Body:**
```json
{
  "available": true,
  "responseText": "We have Aspirin 500mg in stock"
}
```

**Authentication:** Required (Pharmacist role)

**Response:**
```json
{
  "success": true,
  "code": "DRUG_REQUEST_RESPONSE_CREATED",
  "message": "Drug request marked as available successfully",
  "data": {
    "response": {
      "id": 1,
      "drugRequestId": 1,
      "pharmacistId": 2,
      "responseText": "We have Aspirin 500mg in stock",
      "available": true,
      "drug": {
        "id": 100,
        "name": "Aspirin",
        "manufacturer": "Bayer"
      }
    }
  }
}
```

---

### 6. **Patient Views Pharmacy Responses** 👁️
Patients see which pharmacies have the drugs they requested and their availability status.

**Endpoint:**
```
GET /api/pharmacy/v1/:id/pharmacy-responses?page=1&limit=20&available=true
```

**Query Parameters:**
- `page` (optional, default: 1): Pagination page
- `limit` (optional, default: 20): Items per page
- `available` (optional): Filter by 'true' to show only available drugs

**Authentication:** Required (Patient role)

**Response:**
```json
{
  "success": true,
  "code": "PHARMACY_RESPONSES_RETRIEVED",
  "message": "Pharmacy responses retrieved successfully",
  "data": {
    "responses": [
      {
        "id": 1,
        "drugRequestId": 1,
        "pharmacistId": 2,
        "responseText": "We have Aspirin 500mg in stock",
        "available": true,
        "drugRequest": {
          "id": 1,
          "drug": {
            "id": 100,
            "name": "Aspirin",
            "manufacturer": "Bayer"
          }
        },
        "pharmacist": {
          "id": 2,
          "user": {
            "id": 10,
            "name": "Pharmacy Manager",
            "email": "manager@noor.com"
          }
        }
      }
    ],
    "statistics": {
      "total": 15,
      "available": 12,
      "unavailable": 3
    },
    "pagination": { "page": 1, "limit": 20, "total": 15, "pages": 1 }
  }
}
```

---

## 📋 Complete Workflow Example

### Patient Journey:
1. **Search drug** → Create drug request
2. **Patient views responses** → See which pharmacies have it
3. **View access history** → See who accessed their data
4. **Block access** → Revoke access from doctors anytime

### Pharmacist Journey:
1. **View dashboard** → See all pending drug requests
2. **Search location** → Find patient location (if available)
3. **Respond to request** → Mark drug as available or unavailable
4. **Track responses** → See response statistics

---

## 🗄️ Database Updates

### Schema Changes:
- Added `available` boolean field to `PharmacyResponse` model (default: false)
- Tracks clear availability status for each response

### New Models Used:
- `AccessLog` - Records who accessed patient data
- `DrugRequest` - Patient requests for specific drugs
- `PharmacyResponse` - Pharmacist responses with availability
- `Pharmacist` - Includes latitude/longitude for geolocation

---

## 🔒 Security & Authorization

| Endpoint | Role Required | What They Can Do |
|----------|---------------|------------------|
| GET /patients/:id/access-history | Patient | View own access logs |
| POST /patients/:id/block-access | Patient | Revoke doctor access |
| GET /pharmacy/nearby | Public | Find nearby pharmacies |
| GET /pharmacy/dashboard | Pharmacist | View drug requests |
| POST /pharmacy/drug-requests/:id/respond | Pharmacist | Respond to requests |
| GET /pharmacy/:id/pharmacy-responses | Patient | View pharmacy responses |

---

## 📱 API Endpoint Summary

```
Patient Access Control:
  GET    /api/patients/:id/access-history           - View access history
  POST   /api/patients/:id/block-access             - Block doctor access

Pharmacy Features:
  GET    /api/pharmacy/v1/nearby                    - Find nearby pharmacies
  GET    /api/pharmacy/v1/dashboard                 - Pharmacist dashboard
  POST   /api/pharmacy/v1/drug-requests/:id/respond - Respond to drug request
  GET    /api/pharmacy/v1/:id/pharmacy-responses    - View responses to requests
```

---

## ✨ New Files Created

1. **src/controllers/accessHistory.controller.js** - Access history logic
2. **src/controllers/pharmacyDashboard.controller.js** - Pharmacy features
3. **src/routes/accessHistory.routes.js** - Access history routes
4. **src/routes/pharmacyDashboard.routes.js** - Pharmacy routes

---

## ✅ All Compiled & Tested
- ✓ App compiles successfully
- ✓ All syntax validated
- ✓ Routes properly mounted
- ✓ Controllers tested
- ✓ Changes committed to Git
