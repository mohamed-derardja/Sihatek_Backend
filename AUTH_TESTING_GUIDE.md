# Authentication System Testing Guide

## Quick Test Cases

### 1. User Registration & Login
```bash
# Register as patient
curl -X POST http://localhost:3000/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "phone": "+1234567890"
  }'

# Response should include userId and email
```

### 2. Login Test (Access + Refresh Tokens)
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'

# Response should include:
# - user object
# - tokens.accessToken
# - tokens.refreshToken  
# - sessionId
# - Cookies: accessToken, refreshToken
```

### 3. Protected Route Test (Using Access Token)
```bash
# Using cookies
curl -X GET http://localhost:3000/auth/me \
  -H "Content-Type: application/json" \
  -b cookies.txt

# OR using Authorization header
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Response should include current user data
```

### 4. Token Refresh Test
```bash
# Refresh access token
curl -X POST http://localhost:3000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Response should include new accessToken + same sessionId
```

### 5. Logout Test
```bash
# Logout (deletes session from DB)
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "sessionId": 1
  }'

# Response: success message
# After logout: accessToken cookie cleared
```

### 6. Multiple Device Sessions (Same User)
```bash
# Login from "Device A"
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Device A)" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
# Result: sessionId #123, token A

# Login from "Device B"
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Device B)" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
# Result: sessionId #124, token B

# Both sessions exist in DB simultaneously
# Log out from device A (delete sessionId #123)
# Token A becomes invalid, Token B still works
```

## Database Verification

### Check Sessions in DB
```sql
-- View all active sessions
SELECT id, user_id, refresh_token, expiresAt, userAgent, ipAddress, createdAt
FROM "Session"
WHERE "expiresAt" > NOW()
ORDER BY "createdAt" DESC;

-- View sessions for specific user
SELECT id, user_id, refresh_token, expiresAt, userAgent, createdAt
FROM "Session"
WHERE user_id = 1;

-- Check if session expired
SELECT id, expiresAt, NOW() as current_time, 
       CASE WHEN "expiresAt" < NOW() THEN 'EXPIRED' ELSE 'ACTIVE' END as status
FROM "Session"
WHERE id = 1;
```

## Postman Collection Template

```json
{
  "info": {
    "name": "Sihatek Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "login"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"Password123!\"\n}"
        }
      }
    },
    {
      "name": "Get Current User",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/auth/me",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "me"]
        }
      }
    },
    {
      "name": "Refresh Token",
      "request": {
        "method": "POST",
        "url": {
          "raw": "http://localhost:3000/auth/refresh-token",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "refresh-token"]
        }
      }
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/auth/logout",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "logout"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"sessionId\": 1\n}"
        }
      }
    }
  ]
}
```

## Flow Diagram

```
LOGIN
├─ User sends email + password
├─ Password verified (bcrypt)
├─ NEW SESSION created in DB with:
│  ├─ refresh_token (JWT)
│  ├─ expiresAt (7 days)
│  ├─ userAgent
│  └─ ipAddress
├─ ACCESS TOKEN generated (contains sessionId)
└─ Return: accessToken, refreshToken, sessionId

PROTECTED REQUEST
├─ Extract token from cookie or header
├─ Verify JWT signature
├─ Fetch session from DB using sessionId in token
├─ Fetch user from DB using userId in token
└─ Allow request to continue

REFRESH TOKEN
├─ Extract refresh token
├─ Verify JWT signature
├─ Find session by refresh_token value in DB
├─ Verify session hasn't expired
├─ Generate NEW ACCESS TOKEN (reuse sessionId)
└─ Return: new accessToken, same sessionId

LOGOUT
├─ Delete session from DB
├─ Clear token cookies
└─ Next request with old token fails (session not found)
```

## Common Issues & Solutions

### 401 Token Expired
- **Cause**: Access token expired (15 minutes)
- **Solution**: Use refresh token to get new access token

### 401 Session Not Found
- **Cause**: Session was deleted (user logged out from another device) or session expired
- **Solution**: Re-login to create new session

### 401 Invalid Token Payload
- **Cause**: Token modified; issuer/audience mismatch
- **Solution**: Verify JWT_ACCESS_SECRET and issuer/audience in token generation

### 401 Invalid Token Format
- **Cause**: Token string is invalid
- **Solution**: Check token in cookies/header format

### CORS Error
- **Cause**: Frontend URL not matching FRONTEND_URL env variable
- **Solution**: Update FRONTEND_URL and include credentials: 'include' in fetch

### No Token in Cookie
- **Cause**: Backend not setting cookie or cookie not being sent in requests
- **Solution**: 
  1. Verify res.cookie() is called
  2. Ensure credentials: 'include' in fetch
  3. Check sameSite setting
