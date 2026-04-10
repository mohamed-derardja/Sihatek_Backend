# Authentication System Documentation

## Overview
The authentication system implements JWT-based token authentication with session persistence in the database. Both access tokens and refresh tokens are used for secure authentication.

## Token Types

### Access Token
- **Duration**: 15 minutes
- **Storage**: HTTP-only cookie + response body
- **Purpose**: Used for authenticating API requests
- **Payload**:
  - `id`: User ID
  - `sessionId`: Session ID
  - `iss`: Issuer ("Sihatek")
  - `aud`: Audience ("Sihatek Platform")

### Refresh Token
- **Duration**: 7 days
- **Storage**: HTTP-only cookie + database session + response body
- **Purpose**: Used to generate new access tokens when expired
- **Payload**:
  - `id`: User ID

## Database Schema

### Session Table
```
- id: Primary key (auto-incremented)
- user_id: Foreign key to User table
- refresh_token: The refresh token JWT stored uniquely
- expiresAt: Token expiration timestamp
- userAgent: Client's user agent string
- ipAddress: Client's IP address
- createdAt: Session creation timestamp
- updatedAt: Session update timestamp

Indexes:
- Unique index on refresh_token
- Index on user_id
- Index on expiresAt (for cleanup queries)
```

## Authentication Flow

### 1. Login (`POST /auth/login`)
**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Process**:
1. Validate email and password format
2. Find user by email
3. Verify user is verified (for local providers)
4. Compare passwords using bcrypt
5. Create session with:
   - Generated refresh token
   - User agent and IP address
   - 7-day expiration
6. Generate access token with session ID
7. Set both tokens as HTTP-only cookies
8. Return tokens in response body and session ID

**Response**:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "patient",
      "phone": "1234567890"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    },
    "sessionId": 1
  }
}
```

### 2. Protected Routes (with Access Token)
**Request Headers**:
- Cookie: `accessToken=eyJhbGc...`
- OR Authorization: `Bearer eyJhbGc...`

**Middleware Process**:
1. Extract token from cookies or Authorization header
2. Verify token signature and claims
3. Verify audience and issuer match
4. Check token expiration
5. Fetch session from database using sessionId
6. Fetch user from database
7. Attach both to request object (`req.user`, `req.session`)
8. Continue to route handler

### 3. Token Refresh (`POST /auth/refresh-token`)
**Request**:
```json
{
  "refreshToken": "eyJhbGc..." // Or from cookie
}
```

**Process**:
1. Extract refresh token from cookies or body
2. Verify refresh token signature and claims
3. Find session by refresh token
4. Check session expiration
5. Fetch user from database
6. Generate new access token with same session ID
7. Set new access token as cookie
8. Return new access token

**Response**:
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "sessionId": 1
  }
}
```

### 4. Logout (`POST /auth/logout`)
**Request Headers**:
- Cookie: `accessToken=eyJhbGc...` (via authenticate middleware)

**Request Body**:
```json
{
  "sessionId": 1 // Or extracted from token
}
```

**Process**:
1. Delete session from database
2. Clear both token cookies
3. Return success response

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Security Features

### Cookie Security
- **httpOnly**: Prevents JavaScript access, mitigates XSS
- **secure**: Only sent over HTTPS in production
- **sameSite**: Set to 'strict' to prevent CSRF
- **path**: Restricted to root path

### Token Security
- JWT signature verification using HS256 algorithm
- Issuer and audience validation
- Token expiration validation
- Session validation in database
- Password hashing using bcrypt (salt rounds: 10)

### Session Tracking
- Device fingerprinting (user agent, IP address)
- Multiple sessions support (user can be logged in from multiple devices)
- Session expiration enforcement
- One-to-many relationship between users and sessions

## Environment Variables Required
```
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
JWT_EXPIRES_IN_ACCESS=15m
JWT_EXPIRES_IN_REFRESH=7d
NODE_ENV=production|development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@host:port/database
```

## Files Modified/Updated
- `src/controllers/auth.controller.js`: Added COOKIE_OPTIONS configuration
- `src/middlewares/auth.middleware.js`: Fixed Auth model import and token extraction from Authorization header
- Database schema already includes Session table with proper indexes

## Usage Example (Frontend/Client)

### Login
```javascript
const response = await fetch('http://api.example.com/auth/login', {
  method: 'POST',
  credentials: 'include', // Important: include cookies
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const data = await response.json();
console.log(data.data.tokens.accessToken);
```

### Authenticated Request
```javascript
const response = await fetch('http://api.example.com/auth/me', {
  method: 'GET',
  credentials: 'include', // Cookies sent automatically
  headers: {
    'Authorization': `Bearer ${accessToken}` // Or rely on cookie
  }
});
```

### Refresh Token
```javascript
const response = await fetch('http://api.example.com/auth/refresh-token', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  }
  // Token from cookie sent automatically
});
const data = await response.json();
console.log(data.data.accessToken);
```

## Troubleshooting

### Session Not Found Error
- User's session was deleted (logout)
- Database connection issue
- Session expired based on expiresAt field

### Invalid Token Audience
- Token was generated with different issuer/audience
- Verify JWT_* environment variables match

### CORS Issues
- Frontend URL must match FRONTEND_URL in env
- credentials: 'include' required on client
- credentials: true in CORS config on server
