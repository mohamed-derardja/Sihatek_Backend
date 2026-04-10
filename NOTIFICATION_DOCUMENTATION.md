# Notification System & API Documentation

## 🔔 Notification System

### Overview
The notification system provides real-time user communications including access requests, approvals, drug responses, and system alerts.

### Features
- ✅ Real-time notification creation
- ✅ Read/unread tracking
- ✅ Pagination support
- ✅ Batch operations
- ✅ Type-based filtering
- ✅ Statistics tracking

---

## 📋 Notification Endpoints

### Get Notifications
Get all notifications for authenticated user with pagination and filtering.

**Endpoint:**
```
GET /api/notifications/v1/
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `unreadOnly` - Filter unread only (true/false)

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "code": "USER_NOTIFICATIONS_RETRIEVED",
  "message": "User notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "id": 1,
        "userId": 5,
        "message": "Dr. Ahmed requested access to your allergies",
        "type": "access_request",
        "isRead": false,
        "createdAt": "2026-04-10T12:30:00Z",
        "updatedAt": "2026-04-10T12:30:00Z"
      }
    ],
    "stats": {
      "total": 25,
      "unreadCount": 5,
      "readCount": 20
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    }
  }
}
```

**Examples:**
```bash
# Get first 20 notifications
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/notifications/v1/

# Get unread only
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/notifications/v1/?unreadOnly=true"

# Get page 2 with 10 items
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/notifications/v1/?page=2&limit=10"
```

---

### Get Unread Count
Quick endpoint to check number of unread notifications.

**Endpoint:**
```
GET /api/notifications/v1/unread-count
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "code": "UNREAD_COUNT_RETRIEVED",
  "message": "Unread notifications count retrieved",
  "data": {
    "unreadCount": 5
  }
}
```

---

### Mark Single Notification as Read
Mark a specific notification as read.

**Endpoint:**
```
PATCH /api/notifications/v1/{id}/read
```

**Parameters:**
- `id` (path) - Notification ID

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "code": "NOTIFICATION_MARKED_READ",
  "message": "Notification marked as read",
  "data": {
    "notification": {
      "id": 1,
      "userId": 5,
      "message": "...",
      "isRead": true
    }
  }
}
```

---

### Mark All Notifications as Read
Mark all unread notifications as read in one request.

**Endpoint:**
```
PATCH /api/notifications/v1/read-all
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "code": "ALL_NOTIFICATIONS_MARKED_READ",
  "message": "5 notifications marked as read",
  "data": {
    "updatedCount": 5
  }
}
```

---

### Delete Notification
Delete a specific notification.

**Endpoint:**
```
DELETE /api/notifications/v1/{id}
```

**Parameters:**
- `id` (path) - Notification ID

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "code": "NOTIFICATION_DELETED",
  "message": "Notification deleted successfully"
}
```

---

### Delete All Notifications
Delete all notifications for authenticated user.

**Endpoint:**
```
DELETE /api/notifications/v1/
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "code": "ALL_NOTIFICATIONS_DELETED",
  "message": "25 notifications deleted successfully",
  "data": {
    "deletedCount": 25
  }
}
```

---

## 🔧 Creating Notifications Programmatically

### Import the Helper Function
```javascript
import { createNotification } from '../controllers/notification.controller.js';
```

### Usage Examples

**When doctor requests access:**
```javascript
await createNotification({
  userId: patientId,
  message: `Dr. ${doctorName} requested access to your ${scopes.join(', ')}`,
  type: 'access_request'
});
```

**When access is approved:**
```javascript
await createNotification({
  userId: doctorId,
  message: `Patient approved your access request for ${scopes.join(', ')} (expires in ${durationDays} days)`,
  type: 'access_approved'
});
```

**When access is rejected:**
```javascript
await createNotification({
  userId: doctorId,
  message: 'Patient rejected your access request',
  type: 'access_rejected'
});
```

**When pharmacy responds to drug request:**
```javascript
await createNotification({
  userId: patientId,
  message: `${pharmacyName} ${available ? 'has' : 'does not have'} ${drugName} in stock`,
  type: available ? 'drug_available' : 'drug_unavailable'
});
```

**Admin notifications:**
```javascript
await createNotification({
  userId: adminId,
  message: 'New doctor registration pending approval',
  type: 'doctor_pending_approval'
});
```

---

## 📌 Notification Types

| Type | Used When | Example |
|------|-----------|---------|
| `access_request` | Doctor requests patient data | Patient receives notification |
| `access_approved` | Patient approves doctor request | Doctor receives notification |
| `access_rejected` | Patient rejects request | Doctor receives notification |
| `access_blocked` | Patient blocks doctor access | Doctor receives notification |
| `drug_available` | Pharmacy has requested drug | Patient receives notification |
| `drug_unavailable` | Pharmacy doesn't have drug | Patient receives notification |
| `doctor_pending_approval` | New doctor registers | Admin receives notification |
| `pharmacist_pending_approval` | New pharmacist registers | Admin receives notification |
| `prescription_created` | Doctor creates prescription | Patient receives notification |
| `prescription_updated` | Prescription status changes | Patient/Pharmacist receives notification |
| `system_alert` | Important system message | All/specific users |

---

## 🔄 Integration with Existing Features

### Patient Access Control
When creating access requests or granting access:
```javascript
import * as notificationController from '../controllers/notification.controller.js';

// After creating access request
await notificationController.createNotification({
  userId: patient.userId,
  message: `Dr. ${doctor.user.name} requested access to your data`,
  type: 'access_request'
});

// After approving request
await notificationController.createNotification({
  userId: doctor.userId,
  message: `Patient approved your access request`,
  type: 'access_approved'
});
```

### Pharmacy Door Requests
When pharmacist responds to drug request:
```javascript
await notificationController.createNotification({
  userId: patientId,
  message: `${pharmacyName} has ${dogName}${available ? '' : ' NOT'} in stock`,
  type: available ? 'drug_available' : 'drug_unavailable'
});
```

---

## 📊 Database Schema

```prisma
model Notification {
    id        Int      @id @default(autoincrement())
    userId    Int
    message   String
    type      String
    isRead    Boolean  @default(false)

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    user User @relation(fields: [userId], references: [id], name: "UserNotifications", onDelete: Cascade)

    @@index([userId])
    @@index([isRead])
    @@index([type])
}
```

---

## 🔒 Security & Authorization

- Only authenticated users can access notification endpoints
- Users can only access their own notifications
- Notifications belonging to other users cannot be modified/deleted
- No special role required (all roles can receive notifications)

---

## 💡 Best Practices

1. **Always await notification creation** - Ensure notifications are created even if non-critical
2. **Use descriptive messages** - Include relevant names and details
3. **Use appropriate type** - Choose type that matches the event
4. **Include expiry info for access** - Always mention duration for access notifications
5. **Batch cleanup** - Use delete-all for bulk operations instead of individual deletes
6. **Check unread count** - UI can call unread-count endpoint for badge display

---

## 🚀 Accessing Swagger Documentation

Once the app is running, visit:
```
http://localhost:5000/api-docs
```

All API endpoints are fully documented with:
- Request/response examples
- Authentication requirements
- Query parameters
- Error codes
- Try-it-out functionality

---

## 📱 Sample Client Implementation

```javascript
// Fetch unread count for badge
async function getUnreadCount() {
  const response = await fetch('/api/notifications/v1/unread-count', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  updateBadge(data.data.unreadCount);
}

// Get paginated notifications
async function getNotifications(page = 1) {
  const response = await fetch(`/api/notifications/v1/?page=${page}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  displayNotifications(data.data.notifications);
  return data.data.pagination;
}

// Mark as read
async function markAsRead(notificationId) {
  await fetch(`/api/notifications/v1/${notificationId}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Mark all as read
async function markAllAsRead() {
  await fetch('/api/notifications/v1/read-all', {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

---

## ✅ All Implemented & Tested
- ✓ Notification controller with all CRUD operations
- ✓ Notification routes properly mounted
- ✓ Swagger documentation complete
- ✓ Integration points identified
- ✓ Database schema ready (Notification model exists)
- ✓ Example usage provided
