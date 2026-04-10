export const notificationPaths = {
  '/api/notifications/v1/': {
    get: {
      tags: ['Notifications'],
      summary: 'Get user notifications with pagination',
      operationId: 'getUserNotifications',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        { name: 'unreadOnly', in: 'query', schema: { type: 'boolean', description: 'Filter unread only' } },
      ],
      responses: {
        200: {
          description: 'Notifications retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      notifications: { type: 'array' },
                      stats: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          unreadCount: { type: 'integer' },
                          readCount: { type: 'integer' },
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
    },
  },
  '/api/notifications/v1/unread-count': {
    get: {
      tags: ['Notifications'],
      summary: 'Get count of unread notifications',
      operationId: 'getUnreadNotificationsCount',
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Unread count retrieved' },
      },
    },
  },
  '/api/notifications/v1/{id}/read': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark single notification as read',
      operationId: 'markNotificationAsRead',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Notification marked as read' },
        404: { description: 'Notification not found' },
      },
    },
  },
  '/api/notifications/v1/read-all': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark all notifications as read',
      operationId: 'markAllNotificationsAsRead',
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'All notifications marked as read' },
      },
    },
  },
  '/api/notifications/v1/{id}': {
    delete: {
      tags: ['Notifications'],
      summary: 'Delete single notification',
      operationId: 'deleteNotification',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Notification deleted' },
        404: { description: 'Notification not found' },
      },
    },
  },
  '/api/notifications/v1/': {
    delete: {
      tags: ['Notifications'],
      summary: 'Delete all notifications',
      operationId: 'deleteAllNotifications',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: false,
      },
      responses: {
        200: { description: 'All notifications deleted' },
      },
    },
  },
};

export const notificationTags = [
  {
    name: 'Notifications',
    description: 'User notification management with read/unread tracking',
  },
];
