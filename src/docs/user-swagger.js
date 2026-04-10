export const userPaths = {
    '/users': {
        get: {
            tags: ['Users'],
            summary: 'Get all users (Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page number (default: 1)',
                    schema: { type: 'integer', default: 1 },
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Records per page (default: 20)',
                    schema: { type: 'integer', default: 20 },
                },
            ],
            responses: {
                200: {
                    description: 'Users retrieved successfully',
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
                                            users: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/UserResponse',
                                                },
                                            },
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
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
            },
        },
    },
    '/users/profile': {
        get: {
            tags: ['Users'],
            summary: 'Get current user profile',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Profile retrieved successfully',
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
                                            user: {
                                                $ref: '#/components/schemas/UserResponse',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                401: { description: 'Unauthorized' },
                404: { description: 'User not found' },
            },
        },
        patch: {
            tags: ['Users'],
            summary: 'Update current user profile',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                phone: { type: 'string' },
                                imageUrl: { type: 'string' },
                                theme: { type: 'string', enum: ['light', 'dark'] },
                                lang: { type: 'string', enum: ['en', 'ar', 'fr'] },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Profile updated successfully',
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
                                            user: {
                                                $ref: '#/components/schemas/UserResponse',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
            },
        },
        delete: {
            tags: ['Users'],
            summary: 'Delete current user account',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Account deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    code: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                401: { description: 'Unauthorized' },
            },
        },
    },
    '/users/search': {
        get: {
            tags: ['Users'],
            summary: 'Search users by name or email (Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'query',
                    in: 'query',
                    required: true,
                    description: 'Search query (min 2 characters)',
                    schema: { type: 'string' },
                },
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page number (default: 1)',
                    schema: { type: 'integer', default: 1 },
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Records per page (default: 20)',
                    schema: { type: 'integer', default: 20 },
                },
            ],
            responses: {
                200: {
                    description: 'Users search completed',
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
                                            users: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/UserResponse',
                                                },
                                            },
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
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
            },
        },
    },
    '/users/role/{role}': {
        get: {
            tags: ['Users'],
            summary: 'Get users by role (Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'role',
                    in: 'path',
                    required: true,
                    description: 'User role',
                    schema: { type: 'string', enum: ['patient', 'doctor', 'pharmacist', 'admin'] },
                },
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page number (default: 1)',
                    schema: { type: 'integer', default: 1 },
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Records per page (default: 20)',
                    schema: { type: 'integer', default: 20 },
                },
            ],
            responses: {
                200: {
                    description: 'Users retrieved by role successfully',
                },
                400: { description: 'Bad request - invalid role' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
            },
        },
    },
    '/users/stats': {
        get: {
            tags: ['Users'],
            summary: 'Get user statistics (Admin only)',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'User statistics retrieved successfully',
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
                                            totalUsers: { type: 'integer' },
                                            byRole: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        role: { type: 'string' },
                                                        count: { type: 'integer' },
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
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
            },
        },
    },
    '/users/{id}': {
        get: {
            tags: ['Users'],
            summary: 'Get user by ID',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'User ID',
                    schema: { type: 'integer' },
                },
            ],
            responses: {
                200: {
                    description: 'User retrieved successfully',
                },
                401: { description: 'Unauthorized' },
                404: { description: 'User not found' },
            },
        },
        patch: {
            tags: ['Users'],
            summary: 'Update user by ID (Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'User ID',
                    schema: { type: 'integer' },
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
                                phone: { type: 'string' },
                                imageUrl: { type: 'string' },
                                theme: { type: 'string', enum: ['light', 'dark'] },
                                lang: { type: 'string', enum: ['en', 'ar', 'fr'] },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User updated successfully',
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
                404: { description: 'User not found' },
            },
        },
        delete: {
            tags: ['Users'],
            summary: 'Delete user by ID (Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'User ID',
                    schema: { type: 'integer' },
                },
            ],
            responses: {
                200: {
                    description: 'User deleted successfully',
                },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
                404: { description: 'User not found' },
            },
        },
    },
    '/users/{id}/role': {
        patch: {
            tags: ['Users'],
            summary: 'Update user role (Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'User ID',
                    schema: { type: 'integer' },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['role'],
                            properties: {
                                role: { type: 'string', enum: ['patient', 'doctor', 'pharmacist', 'admin'] },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User role updated successfully',
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
                404: { description: 'User not found' },
            },
        },
    },
    '/users/{id}/status': {
        patch: {
            tags: ['Users'],
            summary: 'Update user status (Admin only)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'User ID',
                    schema: { type: 'integer' },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['status'],
                            properties: {
                                status: { type: 'string', enum: ['pending', 'active', 'rejected'] },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User status updated successfully',
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Admin only' },
                404: { description: 'User not found' },
            },
        },
    },
};

export const userTags = [
    {
        name: 'Users',
        description: 'User management operations',
    },
];
