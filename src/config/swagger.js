import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sihatek API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for Sihatek - Healthcare Management Platform',
      contact: {
        name: 'Sihatek Team',
        email: 'support@sihatek.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${ENV.PORT}`,
        description: 'Development Server',
      },
      {
        url: ENV.FRONTEND_URL || 'http://localhost:3000',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from login endpoint',
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'Access token stored in HTTP-only cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            role: {
              type: 'string',
              enum: ['patient', 'doctor', 'pharmacist'],
              example: 'patient',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123!',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123!',
            },
          },
        },
        GoogleAuthRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...',
              description: 'Google ID token from Google OAuth',
            },
            role: {
              type: 'string',
              enum: ['patient', 'doctor', 'pharmacist'],
              example: 'patient',
              description: 'Optional role, defaults to patient',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            code: {
              type: 'string',
              example: 'LOGIN_SUCCESS',
            },
            message: {
              type: 'string',
              example: 'Logged in successfully',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid credentials',
                },
                statusCode: {
                  type: 'integer',
                  example: 401,
                },
                code: {
                  type: 'string',
                  example: 'INVALID_CREDENTIALS',
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
