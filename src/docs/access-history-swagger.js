export const accessHistoryPaths = {
  '/api/patients/{id}/access-history': {
    get: {
      tags: ['Patient Access History'],
      summary: 'Get complete access history audit log',
      operationId: 'getPatientAccessHistory',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Patient ID' },
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: {
          description: 'Access history retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      accessLogs: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            accessedBy: { type: 'object' },
                            accessType: { type: 'string', enum: ['view', 'edit'] },
                            timestamp: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                      pagination: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
        403: { description: 'Insufficient permissions' },
        404: { description: 'Patient not found' },
      },
    },
  },
  '/api/patients/{id}/block-access': {
    post: {
      tags: ['Patient Access History'],
      summary: 'Block/revoke access from specific doctor',
      operationId: 'blockAccessToDoctor',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['doctorId'],
              properties: {
                doctorId: { type: 'integer', example: 2, description: 'Doctor ID to block' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Access blocked successfully' },
        403: { description: 'Insufficient permissions' },
        404: { description: 'Patient or grant not found' },
      },
    },
  },
};

export const accessHistoryTags = [
  {
    name: 'Patient Access History',
    description: 'View access audit logs and block data access from doctors',
  },
];
