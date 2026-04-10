/**
 * Swagger/OpenAPI documentation for Authentication endpoints
 */

export const authPaths = {
  '/auth/register/patient': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new patient',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Patient registered successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { type: 'object' },
                },
              },
            },
          },
        },
        '409': {
          description: 'User already exists',
        },
      },
    },
  },
  '/auth/register/doctor': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new doctor',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Doctor registered successfully',
        },
        '409': {
          description: 'User already exists',
        },
      },
    },
  },
  '/auth/register/pharmacy': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new pharmacy/pharmacist',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Pharmacy registered successfully',
        },
        '409': {
          description: 'User already exists',
        },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login with email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successfully logged in',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        '401': {
          description: 'Invalid credentials or email not verified',
        },
        '404': {
          description: 'User not found',
        },
      },
    },
  },
  '/auth/google-auth': {
    post: {
      tags: ['Authentication'],
      summary: 'Login or register with Google OAuth',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GoogleAuthRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successfully logged in with Google',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        '400': {
          description: 'Missing or invalid Google token',
        },
        '401': {
          description: 'Invalid Google token',
        },
      },
    },
  },
  '/auth/verify-email': {
    post: {
      tags: ['Authentication'],
      summary: 'Verify user email with token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token'],
              properties: {
                token: {
                  type: 'string',
                  example: 'abc123def456',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Email verified successfully',
        },
        '400': {
          description: 'Email already verified',
        },
        '401': {
          description: 'Token expired',
        },
      },
    },
  },
  '/auth/resend-verification': {
    post: {
      tags: ['Authentication'],
      summary: 'Resend verification email',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Verification email sent',
        },
        '400': {
          description: 'Email already verified',
        },
        '404': {
          description: 'User not found',
        },
      },
    },
  },
  '/auth/forgot-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Request password reset',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Password reset email sent',
        },
        '404': {
          description: 'User not found',
        },
      },
    },
  },
  '/auth/reset-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Reset password with token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token', 'password', 'confirmPassword'],
              properties: {
                token: {
                  type: 'string',
                  example: 'abc123def456',
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'NewPassword123!',
                },
                confirmPassword: {
                  type: 'string',
                  format: 'password',
                  example: 'NewPassword123!',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Password reset successfully',
        },
        '400': {
          description: 'Passwords do not match',
        },
        '401': {
          description: 'Token expired or invalid',
        },
      },
    },
  },
  '/auth/refresh-token': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      security: [
        {
          CookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'New access token generated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'No refresh token or session not found',
        },
      },
    },
  },
  '/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout user',
      security: [
        {
          CookieAuth: [],
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                sessionId: { type: 'integer' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Logged out successfully',
        },
        '401': {
          description: 'Unauthorized',
        },
      },
    },
  },
  '/auth/me': {
    get: {
      tags: ['Authentication'],
      summary: 'Get current authenticated user',
      security: [
        {
          CookieAuth: [],
        },
        {
          BearerAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Current user information',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized - No valid token',
        },
      },
    },
  },
  '/auth/sessions': {
    get: {
      tags: ['Authentication'],
      summary: 'Get all active user sessions',
      description: 'Retrieve a list of all active sessions for the authenticated user across all devices',
      security: [
        {
          BearerAuth: [],
        },
        {
          CookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Sessions retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'SESSIONS_RETRIEVED' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      sessions: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            userAgent: { type: 'string' },
                            ipAddress: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            expiresAt: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                      total: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
        },
      },
    },
  },
  '/auth/sessions/{sessionId}/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout from specific session',
      description: 'Logout from a specific device/session by providing its session ID',
      security: [
        {
          BearerAuth: [],
        },
        {
          CookieAuth: [],
        },
      ],
      parameters: [
        {
          name: 'sessionId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'The session ID to logout from',
        },
      ],
      responses: {
        '200': {
          description: 'Successfully logged out from session',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'SESSION_LOGOUT_SUCCESS' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
        },
        '400': {
          description: 'Invalid session ID',
        },
      },
    },
  },
  '/auth/logout-all': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout from all sessions',
      description: 'Logout from all active sessions across all devices. Invalidates all refresh tokens.',
      security: [
        {
          BearerAuth: [],
        },
        {
          CookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Successfully logged out from all sessions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'ALL_SESSIONS_LOGOUT_SUCCESS' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
        },
      },
    },
  },
};

export const authTags = [
  {
    name: 'Authentication',
    description: 'User authentication endpoints',
  },
];
