export const statisticsPaths = {
  '/api/statistics/v1/overview': {
    get: {
      tags: ['Statistics'],
      summary: 'Get role-specific overview dashboard statistics',
      operationId: 'getStatisticsOverview',
      security: [{ BearerAuth: [] }],
      description: 'Returns dashboard overview with role-specific metrics. Patient sees access requests, prescriptions, allergies. Doctor sees access requests and prescriptions. Pharmacist sees drug requests. Admin sees user statistics.',
      responses: {
        200: {
          description: 'Overview statistics retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'STATISTICS_RETRIEVED' },
                  message: { type: 'string', example: 'Overview statistics retrieved' },
                  data: {
                    type: 'object',
                    oneOf: [
                      {
                        title: 'Patient Overview',
                        type: 'object',
                        properties: {
                          role: { type: 'string', example: 'patient' },
                          accessRequests: {
                            type: 'object',
                            properties: {
                              pending: { type: 'integer', example: 3 },
                              approved: { type: 'integer', example: 5 },
                              blocked: { type: 'integer', example: 1 },
                              total: { type: 'integer', example: 9 },
                            },
                          },
                          prescriptions: { type: 'integer', example: 2 },
                          allergies: { type: 'integer', example: 0 },
                          medications: { type: 'integer', example: 4 },
                          unreadNotifications: { type: 'integer', example: 2 },
                        },
                      },
                      {
                        title: 'Doctor Overview',
                        type: 'object',
                        properties: {
                          role: { type: 'string', example: 'doctor' },
                          accessRequests: {
                            type: 'object',
                            properties: {
                              pending: { type: 'integer', example: 2 },
                              approved: { type: 'integer', example: 8 },
                              total: { type: 'integer', example: 10 },
                            },
                          },
                          prescriptions: { type: 'integer', example: 15 },
                          unreadNotifications: { type: 'integer', example: 1 },
                        },
                      },
                      {
                        title: 'Pharmacist Overview',
                        type: 'object',
                        properties: {
                          role: { type: 'string', example: 'pharmacist' },
                          drugRequests: {
                            type: 'object',
                            properties: {
                              pending: { type: 'integer', example: 4 },
                              responded: { type: 'integer', example: 12 },
                              total: { type: 'integer', example: 16 },
                            },
                          },
                          prescriptionsFilled: { type: 'integer', example: 20 },
                          unreadNotifications: { type: 'integer', example: 3 },
                        },
                      },
                      {
                        title: 'Admin Overview',
                        type: 'object',
                        properties: {
                          role: { type: 'string', example: 'admin' },
                          usersByRole: {
                            type: 'object',
                            properties: {
                              patient: { type: 'integer', example: 150 },
                              doctor: { type: 'integer', example: 30 },
                              pharmacist: { type: 'integer', example: 20 },
                              admin: { type: 'integer', example: 5 },
                            },
                          },
                          usersByStatus: {
                            type: 'object',
                            properties: {
                              pending: { type: 'integer', example: 10 },
                              active: { type: 'integer', example: 200 },
                              rejected: { type: 'integer', example: 5 },
                            },
                          },
                          pendingApprovals: { type: 'integer', example: 10 },
                          totalUsers: { type: 'integer', example: 205 },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized - invalid or missing token' },
        500: { description: 'Server error' },
      },
    },
  },
  '/api/statistics/v1/detailed': {
    get: {
      tags: ['Statistics'],
      summary: 'Get detailed statistics with breakdowns and recent activities',
      operationId: 'getDetailedStatistics',
      security: [{ BearerAuth: [] }],
      description: 'Returns comprehensive statistics including profile info, activity breakdown, and recent events. Role-specific responses for Patient, Doctor, Pharmacist, and Admin.',
      responses: {
        200: {
          description: 'Detailed statistics retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  code: { type: 'string', example: 'STATISTICS_RETRIEVED' },
                  message: { type: 'string', example: 'Detailed statistics retrieved' },
                  data: {
                    type: 'object',
                    title: 'Detailed Statistics',
                    properties: {
                      profile: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          role: { type: 'string', example: 'patient' },
                          joinDate: { type: 'string', format: 'date', example: '2025-06-15' },
                        },
                      },
                      breakdown: {
                        type: 'object',
                        description: 'Role-specific activity breakdown',
                        properties: {
                          accessRequests: { type: 'array', description: 'For patient: pending/approved/blocked counts' },
                          prescriptions: { type: 'array', description: 'For doctor: issued prescriptions' },
                          drugRequests: { type: 'array', description: 'For pharmacist: drug request responses' },
                          approvals: { type: 'array', description: 'For admin: pending user approvals' },
                        },
                      },
                      recentActivities: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            action: { type: 'string', example: 'Access Request Approved' },
                            timestamp: { type: 'string', format: 'date-time' },
                            details: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized - invalid or missing token' },
        500: { description: 'Server error' },
      },
    },
  },
};

export const statisticsTags = [
  {
    name: 'Statistics',
    description: 'Role-specific dashboard statistics and analytics. Overview shows quick metrics, detailed provides comprehensive breakdown with activities.',
  },
];
