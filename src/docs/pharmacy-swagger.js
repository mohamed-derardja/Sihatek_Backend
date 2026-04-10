export const pharmacyPaths = {
  '/api/pharmacy/v1/nearby': {
    get: {
      tags: ['Pharmacy'],
      summary: 'Find pharmacies near location using geolocation',
      operationId: 'getNearbyPharmaciesWithDrug',
      parameters: [
        { name: 'latitude', in: 'query', required: true, schema: { type: 'number', example: 30.0444 } },
        { name: 'longitude', in: 'query', required: true, schema: { type: 'number', example: 31.2357 } },
        { name: 'radius', in: 'query', schema: { type: 'number', default: 10, description: 'Search radius in km' } },
        { name: 'drugName', in: 'query', schema: { type: 'string', description: 'Optional drug filter' } },
      ],
      responses: {
        200: {
          description: 'Nearby pharmacies found',
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
                      pharmacies: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            pharmacyName: { type: 'string' },
                            distance: { type: 'number', description: 'Distance in km' },
                            location: { type: 'string' },
                            user: { type: 'object' },
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
        400: { description: 'Invalid coordinates' },
      },
    },
  },
  '/api/pharmacy/v1/dashboard': {
    get: {
      tags: ['Pharmacy'],
      summary: 'Get pharmacist dashboard with pending drug requests',
      operationId: 'getPharmacistDashboard',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'Dashboard retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      stats: {
                        type: 'object',
                        properties: {
                          totalDrugRequests: { type: 'integer' },
                          respondedCount: { type: 'integer' },
                          pendingCount: { type: 'integer' },
                        },
                      },
                      drugRequests: { type: 'array' },
                    },
                  },
                },
              },
            },
          },
        },
        403: { description: 'Pharmacist role required' },
      },
    },
  },
  '/api/pharmacy/v1/drug-requests/{id}/respond': {
    post: {
      tags: ['Pharmacy'],
      summary: 'Respond to drug request with availability status',
      operationId: 'respondToDrugRequest',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['available'],
              properties: {
                available: { type: 'boolean', example: true, description: 'Is drug available' },
                responseText: { type: 'string', example: 'In stock with 500mg dosage' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Response created/updated' },
        403: { description: 'Pharmacist role required' },
        404: { description: 'Drug request not found' },
      },
    },
  },
  '/api/pharmacy/v1/{id}/pharmacy-responses': {
    get: {
      tags: ['Pharmacy'],
      summary: 'Get all pharmacy responses to drug requests',
      operationId: 'getPharmacyResponses',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        { name: 'available', in: 'query', schema: { type: 'boolean', description: 'Filter by availability' } },
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: {
          description: 'Pharmacy responses retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      responses: { type: 'array' },
                      statistics: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          available: { type: 'integer' },
                          unavailable: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        403: { description: 'Insufficient permissions' },
      },
    },
  },
};

export const pharmacyTags = [
  {
    name: 'Pharmacy',
    description: 'Geolocation pharmacy finder, pharmacist dashboard, and drug availability tracking',
  },
];
