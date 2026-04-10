import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from './env.js';
import { authPaths, authTags } from '../docs/auth-swagger.js';
import { drugPaths, drugTags } from '../docs/drug-swagger.js';
import { userPaths, userTags } from '../docs/user-swagger.js';
import { patientAccessPaths, patientAccessTags } from '../docs/patient-access-swagger.js';
import { accessHistoryPaths, accessHistoryTags } from '../docs/access-history-swagger.js';
import { pharmacyPaths, pharmacyTags } from '../docs/pharmacy-swagger.js';
import { notificationPaths, notificationTags } from '../docs/notification-swagger.js';
import { statisticsPaths, statisticsTags } from '../docs/statistics-swagger.js';
import { settingsPaths, settingsTags } from '../docs/settings-swagger.js';

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
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            role: {
              type: 'string',
              enum: ['patient', 'doctor', 'pharmacist', 'admin'],
              example: 'patient',
            },
            status: {
              type: 'string',
              enum: ['pending', 'active', 'rejected'],
              example: 'active',
            },
            theme: {
              type: 'string',
              enum: ['light', 'dark'],
              example: 'light',
            },
            lang: {
              type: 'string',
              enum: ['en', 'ar', 'fr'],
              example: 'en',
            },
            imageUrl: {
              type: 'string',
              example: 'https://example.com/image.jpg',
            },
            isVerified: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
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
    tags: [...authTags, ...drugTags, ...userTags, ...patientAccessTags, ...accessHistoryTags, ...pharmacyTags, ...notificationTags, ...statisticsTags, ...settingsTags],
    paths: { ...authPaths, ...drugPaths, ...userPaths, ...patientAccessPaths, ...accessHistoryPaths, ...pharmacyPaths, ...notificationPaths, ...statisticsPaths, ...settingsPaths },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
