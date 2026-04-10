# Google Authentication Implementation Guide

## Overview
Complete Google OAuth 2.0 authentication flow has been implemented for Sihatek. Users can login/register using their Google accounts.

## Setup Required

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Identity Services API
4. Create OAuth 2.0 credential (Web Application)
5. Add authorized redirect URIs (for frontend):
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)
6. Copy the Client ID

### 2. Environment Setup
Add to `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Frontend Setup (Example with React)
```bash
npm install @react-oauth/google
```

```jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function LoginComponent() {
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; // This is the JWT from Google
    
    // Send to backend
    const response = await fetch('http://api.example.com/auth/google-auth', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        role: 'patient', // Optional: 'patient', 'doctor', 'pharmacist'
      })
    });
    
    const data = await response.json();
    console.log('Login successful', data);
    // Store tokens or redirect
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
      />
    </GoogleOAuthProvider>
  );
}
```

## API Endpoint

### POST /auth/google-auth
**Purpose**: Authenticate or register user via Google OAuth

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...",
  "role": "patient" // Optional: "patient" (default), "doctor", "pharmacist"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Logged in with Google successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@gmail.com",
      "role": "patient",
      "phone": null,
      "provider": "google"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    },
    "sessionId": 1
  }
}
```

**Response (Error - 400/401)**:
```json
{
  "success": false,
  "error": {
    "message": "Invalid Google token",
    "statusCode": 401,
    "code": "INVALID_GOOGLE_TOKEN"
  }
}
```

## Authentication Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Google returns ID token (JWT)
   ↓
3. Frontend sends token to POST /auth/google-auth
   ↓
4. Backend verifies token with Google's OAuth2Client
   ↓
5. Extract email, googleId, name from token payload
   ↓
6. Check if user exists by email:
   
   If EXISTS:
   ├─ Link Google account (update googleId, provider)
   │
   If NOT EXISTS:
   └─ Create new user with:
      - name from Google
      - email from Google
      - provider: "google"
      - googleId: from token
      - isVerified: true (auto-verified via Google)
   ↓
7. Create session with refresh token
   ↓
8. Generate access token (15 min)
   ↓
9. Set HTTP-only cookies
   ↓
10. Return tokens + session + user info
```

## Database Schema Changes

The `User` model already supports Google OAuth:
- `googleId`: Unique identifier from Google (sub)
- `provider`: 'local' | 'google'
- `isVerified`: Auto-set to true for Google accounts

### User States After Google Login

**Case 1: New Google User**
```
User NOT found by email
→ Create new user
→ provider: "google"
→ googleId: populated
→ isVerified: true
→ Role: specified in request (default: patient)
```

**Case 2: Existing Local User**
```
User found by email
→ If googleId is null: Link Google account
→ Update provider to "google"
→ Set isVerified: true
→ Keep existing role and data
```

**Case 3: Returning Google User**
```
User found by email
→ googleId already set
→ Simply create new session
→ Return tokens as normal
```

## Error Handling

### Missing Google Token
```json
{
  "statusCode": 400,
  "message": "Google token is required",
  "code": "MISSING_GOOGLE_TOKEN"
}
```

### Invalid Google Token
```json
{
  "statusCode": 401,
  "message": "Invalid Google token",
  "code": "INVALID_GOOGLE_TOKEN"
}
```

Causes:
- Token signature is invalid
- Token payload missing email or sub
- Token audience doesn't match GOOGLE_CLIENT_ID
- Token is expired

## Security Features

✅ **Token Verification**
- JWT signature validated with Google's public keys
- Audience validated against GOOGLE_CLIENT_ID
- Token expiration checked

✅ **HTTP-Only Cookies**
- Tokens stored in secure HTTP-only cookies
- CSRF protection with sameSite=strict
- Secure flag enabled in production

✅ **User Verification**
- Email pre-verified via Google
- No separate email verification needed
- isVerified automatically set to true

✅ **Session Management**
- Each login creates new session in DB
- Multiple concurrent sessions per user
- 7-day session expiration
- User agent and IP tracking

## Testing

### Using Postman
1. Get Google ID token from Google Console test credentials
2. POST to `http://localhost:3000/auth/google-auth`
   ```json
   {
     "token": "YOUR_GOOGLE_ID_TOKEN",
     "role": "patient"
   }
   ```

### Using cURL
```bash
curl -X POST http://localhost:3000/auth/google-auth \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...",
    "role": "patient"
  }'
```

### Testing Account Linking
1. Register with local email: `test@gmail.com`
2. Later, login with Google using same email: `test@gmail.com`
3. System links Google account to existing user
4. User data preserved

## Account Linking Scenarios

### Scenario 1: Email Conflict Resolution
```
Local User: test@gmail.com (password: "123456")
Google Login: test@gmail.com

Result: Google account linked to existing user
- provider updated to "google"
- googleId set
- isVerified set to true
- All user data preserved
```

### Scenario 2: New Google User
```
Google Login: newuser@gmail.com

Result: New user created
- name from Google
- email: newuser@gmail.com
- provider: "google"
- googleId: populated
- Role: patient (or specified)
- isVerified: true
```

## Frontend Implementation Examples

### React + TypeScript
```typescript
interface GoogleAuthRequest {
  token: string;
  role?: 'patient' | 'doctor' | 'pharmacist';
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    sessionId: number;
  };
}

async function loginWithGoogle(googleToken: string) {
  const payload: GoogleAuthRequest = {
    token: googleToken,
    role: 'patient',
  };

  const response = await fetch('/auth/google-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();
  
  if (data.success) {
    // Authentication successful
    localStorage.setItem('sessionId', data.data.sessionId.toString());
    // Redirect to dashboard
  }
}
```

### Next.js API Route
```typescript
// pages/api/auth/google.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, role } = req.body;

  try {
    const response = await fetch('http://localhost:3000/auth/google-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, role }),
    });

    const data = await response.json();
    
    // Set cookies via Next.js
    res.setHeader('Set-Cookie', `accessToken=${data.data.tokens.accessToken}; HttpOnly`);
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
```

## Troubleshooting

### "Invalid Google token" Error
**Problem**: Token verification fails
**Solutions**:
- Verify GOOGLE_CLIENT_ID is correct
- Check token isn't expired (typically 1 hour)
- Ensure token is complete (no truncation)
- Verify frontend is sending raw JWT token, not credential object

### "User not found after Google login"
**Problem**: Session shows null user
**Solutions**:
- Check database connection
- Verify user was actually created
- Check user role default in createUser

### CORS Errors
**Problem**: Cross-origin request blocked
**Solutions**:
- Add frontend URL to FRONTEND_URL in .env
- Ensure credentials: 'include' in fetch request
- Check CORS headers in response

## Environment Checklist

- [ ] GOOGLE_CLIENT_ID set in .env
- [ ] Frontend has Google Client ID configured
- [ ] Authorized redirect URIs added in Google Console
- [ ] Database has fresh migration
- [ ] API server running
- [ ] Frontend server running on correct port

## Files Modified

- `src/services/auth.service.js` - Added loginWithGoogle function
- `src/controllers/auth.controller.js` - Added googleAuth controller
- `src/utils/google.js` - Updated to use Errors import
- `src/errors/errors.js` - Added Google auth errors
- `src/config/env.js` - Added GOOGLE_CLIENT_ID
- `src/routes/auth.routes.js` - Already has route configured
