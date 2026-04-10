/**
 * Swagger/OpenAPI documentation for Drugs endpoints
 */

export const drugPaths = {
  '/drugs': {
    get: {
      tags: ['Drugs'],
      summary: 'Get all drugs with pagination',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            default: 20,
          },
        },
      ],
      responses: {
        '200': {
          description: 'Drugs retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  code: { type: 'string' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      drugs: { type: 'array' },
                      total: { type: 'integer' },
                      pages: { type: 'integer' },
                      currentPage: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Drugs'],
      summary: 'Create new drug (admin only)',
      security: [
        { BearerAuth: [] },
        { CookieAuth: [] },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string', example: 'Paracetamol' },
                description: { type: 'string', example: 'Pain reliever and fever reducer' },
                composition: { type: 'string', example: 'Acetaminophen 500mg' },
                uses: { type: 'string', example: 'For pain and fever' },
                sideEffects: { type: 'string', example: 'Nausea, dizziness' },
                imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
                manufacturer: { type: 'string', example: 'Pharma Inc' },
                excellentReviewPercent: { type: 'number', example: 75.5 },
                averageReviewPercent: { type: 'number', example: 20.2 },
                poorReviewPercent: { type: 'number', example: 4.3 },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Drug created successfully',
        },
        '400': {
          description: 'Invalid payload',
        },
        '409': {
          description: 'Drug with this name already exists',
        },
      },
    },
  },
  '/drugs/search': {
    get: {
      tags: ['Drugs'],
      summary: 'Search drugs by name, description, manufacturer or uses',
      parameters: [
        {
          name: 'query',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Search query (minimum 2 characters)',
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            default: 20,
          },
        },
      ],
      responses: {
        '200': {
          description: 'Drugs search completed',
        },
        '400': {
          description: 'Invalid search query',
        },
      },
    },
  },
  '/drugs/{id}': {
    get: {
      tags: ['Drugs'],
      summary: 'Get drug by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Drug retrieved successfully',
        },
        '404': {
          description: 'Drug not found',
        },
      },
    },
    patch: {
      tags: ['Drugs'],
      summary: 'Update drug (admin only)',
      security: [
        { BearerAuth: [] },
        { CookieAuth: [] },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                composition: { type: 'string' },
                uses: { type: 'string' },
                sideEffects: { type: 'string' },
                imageUrl: { type: 'string' },
                manufacturer: { type: 'string' },
                excellentReviewPercent: { type: 'number' },
                averageReviewPercent: { type: 'number' },
                poorReviewPercent: { type: 'number' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Drug updated successfully',
        },
        '404': {
          description: 'Drug not found',
        },
        '409': {
          description: 'Drug name already exists',
        },
      },
    },
    delete: {
      tags: ['Drugs'],
      summary: 'Delete drug (admin only)',
      security: [
        { BearerAuth: [] },
        { CookieAuth: [] },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Drug deleted successfully',
        },
        '404': {
          description: 'Drug not found',
        },
      },
    },
  },
};

export const drugTags = [
  {
    name: 'Drugs',
    description: 'Drug management endpoints',
  },
];
