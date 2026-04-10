# Swagger API Documentation

## Quick Start

### Access the Documentation

Once the server is running, navigate to:
```
http://localhost:3000/api-docs
```

This will display the interactive Swagger UI with all endpoints documented.

## Installation

The Swagger documentation requires two additional packages that have been added to `package.json`:

```bash
npm install swagger-jsdoc swagger-ui-express
```

## Features

✅ **Interactive API Testing**
- Try out endpoints directly from the browser
- Test with different request bodies
- See real responses and status codes

✅ **Complete Endpoint Documentation**
- Request and response schemas
- Authentication requirements
- Error codes and descriptions
- Example values

✅ **Security Schemes**
- Cookie-based authentication (accessToken)
- Bearer token authentication (JWT)
- Persistent authorization during session

## Authentication

### Using Cookies (Recommended)
1. Login via POST `/auth/login`
2. Swagger automatically uses cookies for subsequent requests
3. Protected routes will automatically include auth

### Using Bearer Token
1. Login via POST `/auth/login`
2. Copy the access token from response
3. Click "Authorize" button in Swagger UI
4. Select "BearerAuth"
5. Paste your token

## API Endpoints Overview

### Public Routes

#### Registration
- `POST /auth/register/patient` - Register as patient
- `POST /auth/register/doctor` - Register as doctor
- `POST /auth/register/pharmacy` - Register as pharmacy/pharmacist

#### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/google-auth` - Login with Google OAuth
- `POST /auth/verify-email` - Verify email with token
- `POST /auth/resend-verification` - Resend verification email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/refresh-token` - Get new access token

### Protected Routes
- `POST /auth/logout` - Logout (requires auth)
- `GET /auth/me` - Get current user info (requires auth)

## Testing Workflow

### 1. Register a User
```bash
POST /auth/register/patient
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890"
}
```

### 2. Verify Email (in development, token is in system logs or email)
```bash
POST /auth/verify-email
{
  "token": "verification-token-from-email"
}
```

### 3. Login
```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### 4. Access Protected Routes
```bash
GET /auth/me
# Automatically uses accessToken cookie
```

### 5. Refresh Token
```bash
POST /auth/refresh-token
# Automatically uses refreshToken cookie
```

### 6. Logout
```bash
POST /auth/logout
```

## Response Format

### Success Response
```json
{
  "success": true,
  "code": "LOGIN_SUCCESS",
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "patient"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials",
    "statusCode": 401,
    "code": "INVALID_CREDENTIALS"
  }
}
```

## Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `EMAIL_NOT_VERIFIED` | 403 | Email not verified yet |
| `USER_ALREADY_EXISTS` | 409 | User with this email exists |
| `USER_NOT_FOUND` | 404 | User account not found |
| `TOKEN_EXPIRED` | 401 | Token has expired |
| `INVALID_TOKEN` | 401 | Token is invalid |
| `SESSION_NOT_FOUND` | 401 | Session was deleted or expired |
| `ALREADY_VERIFIED` | 400 | Email already verified |
| `INVALID_GOOGLE_TOKEN` | 401 | Google token invalid |
| `MISSING_GOOGLE_TOKEN` | 400 | Google token required |

## Authentication Flow Diagram

```
Client → POST /auth/login
         ↓
Server ← Returns tokens + Sets cookies
         ↓
Client → GET /auth/me (with cookie/bearer token)
         ↓
Server ← Returns user info
         ↓
Client → POST /auth/refresh-token (when token expires)
         ↓
Server ← Returns new access token
         ↓
Client → POST /auth/logout
         ↓
Server ← Deletes session + Clears cookies
```

## Configuration

The Swagger documentation is configured in `src/config/swagger.js` with:
- API title and version
- Server URLs (development and production)
- Security schemes (Cookie and Bearer)
- Common schemas for requests/responses

## Additional Notes

### Cookie Handling
- Access token: 15 minute expiration
- Refresh token: 7 day expiration
- Both stored as HTTP-only cookies for security

### CORS
- Configured to accept requests from `FRONTEND_URL`
- Credentials enabled for cookie transmission
- Allowed methods: GET, POST, PUT, DELETE

### Rate Limiting (Future Enhancement)
- Consider implementing rate limiting for production
- Protect against brute force attacks

## Troubleshooting

### "Cannot read properties of undefined" in Swagger
- Ensure package.json dependencies are installed
- Run `npm install`
- Restart the server

### Cookies not persisting
- Check that `credentials: 'include'` is set in frontend fetch
- Verify FRONTEND_URL matches actual frontend origin
- Check browser cookie settings

### Authorization not working
- Verify token is valid (not expired)
- Check auth middleware is applied to route
- Ensure "Authorize" button was clicked in Swagger

## Files Updated

1. **package.json** - Added swagger dependencies
2. **src/app.js** - Added swagger UI middleware
3. **src/config/swagger.js** - Swagger configuration
4. **src/routes/auth.routes.js** - Added JSDoc comments with endpoint docs

## Next Steps

- Deploy to production with appropriate server URLs
- Add rate limiting middleware
- Document additional routes as they're added
- Implement API versioning (e.g., `/api/v1/`)
