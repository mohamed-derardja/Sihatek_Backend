export const patientAccessPaths = {
  '/api/patient-access/v1/requests': {
    post: {
      tags: ['Patient Access Control'],
      summary: 'Doctor requests access to patient data',
      operationId: 'createAccessRequest',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['patientUserId', 'scopes'],
              properties: {
                patientUserId: { type: 'integer', example: 5 },
                scopes: {
                  type: 'array',
                  example: ['profile', 'allergies'],
                  items: {
                    type: 'string',
                    enum: ['profile', 'allergies', 'medical_conditions', 'medications', 'prescriptions', 'drug_requests', 'all'],
                  },
                },
                message: { type: 'string', example: 'Need access to review patient records' },
                durationDays: { type: 'integer', example: 30, description: 'Requested duration in days' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Access request created successfully' },
        400: { description: 'Validation error' },
        403: { description: 'Insufficient permissions' },
      },
    },
  },
  '/api/patient-access/v1/requests/my-sent': {
    get: {
      tags: ['Patient Access Control'],
      summary: 'List sent access requests (Doctor only)',
      operationId: 'listMySentRequests',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: { description: 'Sent requests retrieved' },
        403: { description: 'Insufficient permissions' },
      },
    },
  },
  '/api/patient-access/v1/requests/my-received': {
    get: {
      tags: ['Patient Access Control'],
      summary: 'List received access requests (Patient only)',
      operationId: 'listMyReceivedRequests',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: { description: 'Received requests retrieved' },
        403: { description: 'Insufficient permissions' },
      },
    },
  },
  '/api/patient-access/v1/requests/{id}': {
    patch: {
      tags: ['Patient Access Control'],
      summary: 'Patient responds to access request',
      operationId: 'respondToRequest',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: { type: 'string', enum: ['approved', 'rejected'] },
                durationDays: { type: 'integer', example: 30, description: 'Duration for approval' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Request updated' },
        404: { description: 'Request not found' },
        403: { description: 'Insufficient permissions' },
      },
    },
  },
  '/api/patient-access/v1/grants': {
    get: {
      tags: ['Patient Access Control'],
      summary: 'List active access grants (Patient only)',
      operationId: 'listMyGrants',
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Grants retrieved with expiry information' },
        403: { description: 'Insufficient permissions' },
      },
    },
  },
  '/api/patient-access/v1/grants/{doctorId}': {
    delete: {
      tags: ['Patient Access Control'],
      summary: 'Revoke access grant (Patient only)',
      operationId: 'revokeGrant',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'doctorId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Grant revoked' },
        404: { description: 'Grant not found' },
      },
    },
  },
};

export const patientAccessTags = [
  {
    name: 'Patient Access Control',
    description: 'Request-based access control with time-limited scope grants',
  },
];
