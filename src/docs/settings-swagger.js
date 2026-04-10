export const settingsPaths = {
  '/api/settings/v1/': {
    get: {
      tags: ['Settings'],
      summary: 'Get user settings and preferences',
      operationId: 'getUserSettings',
      security: [{ BearerAuth: [] }],
      description: 'Retrieve current user settings including theme, language, and profile information.',
      responses: {
        200: {
          description: 'Settings retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'SETTINGS_RETRIEVED' },
                  message: { type: 'string', example: 'Settings retrieved' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'John Doe' },
                      email: { type: 'string', example: 'john@example.com' },
                      phone: { type: 'string', example: '+1234567890' },
                      theme: { type: 'string', enum: ['light', 'dark', 'auto'], example: 'light' },
                      language: { type: 'string', enum: ['en', 'ar', 'fr'], example: 'en' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
    patch: {
      tags: ['Settings'],
      summary: 'Update user settings',
      operationId: 'updateUserSettings',
      security: [{ BearerAuth: [] }],
      description: 'Update user preferences like theme and language. Only provided fields are updated.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                theme: {
                  type: 'string',
                  enum: ['light', 'dark', 'auto'],
                  description: 'UI theme preference',
                  example: 'dark',
                },
                language: {
                  type: 'string',
                  enum: ['en', 'ar', 'fr'],
                  description: 'Language preference',
                  example: 'ar',
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Settings updated successfully' },
        400: { description: 'Invalid theme or language value' },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/api/settings/v1/notifications': {
    get: {
      tags: ['Settings'],
      summary: 'Get notification preferences',
      operationId: 'getNotificationPreferences',
      security: [{ BearerAuth: [] }],
      description: 'Retrieve which notification types are enabled. Includes 12 notification types: access_requested, access_approved, access_rejected, access_blocked, drug_available, drug_unavailable, doctor_approved, doctor_rejected, pharmacist_approved, pharmacist_rejected, prescription_created, prescription_filled.',
      responses: {
        200: {
          description: 'Notification preferences retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'PREFERENCES_RETRIEVED' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      access_requested: { type: 'boolean', example: true },
                      access_approved: { type: 'boolean', example: true },
                      access_rejected: { type: 'boolean', example: false },
                      access_blocked: { type: 'boolean', example: true },
                      drug_available: { type: 'boolean', example: true },
                      drug_unavailable: { type: 'boolean', example: false },
                      doctor_approved: { type: 'boolean', example: true },
                      doctor_rejected: { type: 'boolean', example: true },
                      pharmacist_approved: { type: 'boolean', example: true },
                      pharmacist_rejected: { type: 'boolean', example: false },
                      prescription_created: { type: 'boolean', example: true },
                      prescription_filled: { type: 'boolean', example: true },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
    patch: {
      tags: ['Settings'],
      summary: 'Update notification preferences',
      operationId: 'updateNotificationPreferences',
      security: [{ BearerAuth: [] }],
      description: 'Enable or disable specific notification types. Only provided types are updated.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                access_requested: { type: 'boolean', example: true },
                access_approved: { type: 'boolean', example: true },
                access_rejected: { type: 'boolean', example: false },
                access_blocked: { type: 'boolean', example: true },
                drug_available: { type: 'boolean', example: true },
                drug_unavailable: { type: 'boolean', example: false },
                doctor_approved: { type: 'boolean', example: true },
                doctor_rejected: { type: 'boolean', example: true },
                pharmacist_approved: { type: 'boolean', example: true },
                pharmacist_rejected: { type: 'boolean', example: false },
                prescription_created: { type: 'boolean', example: true },
                prescription_filled: { type: 'boolean', example: true },
              },
              description: 'Set to true to enable, false to disable notifications for each type',
            },
          },
        },
      },
      responses: {
        200: { description: 'Notification preferences updated successfully' },
        400: { description: 'Invalid notification type' },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/api/settings/v1/privacy': {
    patch: {
      tags: ['Settings'],
      summary: 'Update privacy settings',
      operationId: 'updatePrivacySettings',
      security: [{ BearerAuth: [] }],
      description: 'Control privacy settings like profile visibility and access request permissions.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                showProfile: {
                  type: 'boolean',
                  description: 'Make profile visible to others',
                  example: true,
                },
                allowAccessRequests: {
                  type: 'boolean',
                  description: 'Allow doctors/pharmacists to request access',
                  example: true,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Privacy settings updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'SETTINGS_UPDATED' },
                  message: { type: 'string', example: 'Privacy settings updated' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/api/settings/v1/security': {
    get: {
      tags: ['Settings'],
      summary: 'Get account security information',
      operationId: 'getAccountSecurity',
      security: [{ BearerAuth: [] }],
      description: 'Retrieve security information including active sessions and last login details.',
      responses: {
        200: {
          description: 'Security information retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'SECURITY_INFO_RETRIEVED' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      email: { type: 'string', example: 'john@example.com' },
                      emailVerified: { type: 'boolean', example: true },
                      twoFactorEnabled: { type: 'boolean', example: false },
                      lastLogin: { type: 'string', format: 'date-time', example: '2026-04-11T10:30:00Z' },
                      activeSessions: {
                        type: 'integer',
                        example: 1,
                        description: 'Number of active sessions',
                      },
                      passwordChangedAt: { type: 'string', format: 'date-time', example: '2026-03-15T08:00:00Z' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/api/settings/v1/change-password': {
    post: {
      tags: ['Settings'],
      summary: 'Change user password',
      operationId: 'changePassword',
      security: [{ BearerAuth: [] }],
      description: 'Change password with validation. New password must be different from old password and at least 8 characters.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['oldPassword', 'newPassword', 'confirmPassword'],
              properties: {
                oldPassword: {
                  type: 'string',
                  format: 'password',
                  description: 'Current password',
                  example: 'OldPassword123!',
                },
                newPassword: {
                  type: 'string',
                  format: 'password',
                  description: 'New password (minimum 8 characters)',
                  example: 'NewPassword456!',
                },
                confirmPassword: {
                  type: 'string',
                  format: 'password',
                  description: 'Confirm new password',
                  example: 'NewPassword456!',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'PASSWORD_CHANGED' },
                  message: { type: 'string', example: 'Password changed successfully' },
                },
              },
            },
          },
        },
        400: { description: 'Invalid password or passwords do not match' },
        401: { description: 'Unauthorized or incorrect old password' },
      },
    },
  },
  '/api/settings/v1/delete-account': {
    post: {
      tags: ['Settings'],
      summary: 'Delete user account permanently',
      operationId: 'deleteAccount',
      security: [{ BearerAuth: [] }],
      description: 'Permanently delete user account. This action is irreversible. All user data will be deleted.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['password', 'confirmation'],
              properties: {
                password: {
                  type: 'string',
                  format: 'password',
                  description: 'User password for verification',
                  example: 'UserPassword123!',
                },
                confirmation: {
                  type: 'string',
                  description: 'User must type DELETE to confirm',
                  example: 'DELETE',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Account deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'ACCOUNT_DELETED' },
                  message: { type: 'string', example: 'Account deleted successfully' },
                },
              },
            },
          },
        },
        400: { description: 'Invalid confirmation text or password incorrect' },
        401: { description: 'Unauthorized' },
      },
    },
  },
};

export const settingsTags = [
  {
    name: 'Settings',
    description: 'User preferences and account management. Includes theme/language settings, notification preferences, privacy controls, security information, password management, and account deletion.',
  },
];
