import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

export const createNotification = async ({ userId, message, type }) => {
    if (!userId || !message || !type) {
        return { ok: false, reason: 'missing_fields' };
    }

    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                message,
                type,
                isRead: false,
            },
        });
        return { ok: true, notification };
    } catch (error) {
        return { ok: false, reason: 'creation_failed', error };
    }
};

export const getUserNotifications = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const whereCondition = { userId: req.user.id };
    if (unreadOnly) {
        whereCondition.isRead = false;
    }

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            skip,
            take: safeLimit,
        }),
        prisma.notification.count({ where: whereCondition }),
    ]);

    const unreadCount = await prisma.notification.count({
        where: { userId: req.user.id, isRead: false },
    });

    res.status(200).json({
        success: true,
        code: 'USER_NOTIFICATIONS_RETRIEVED',
        message: 'User notifications retrieved successfully',
        data: {
            notifications,
            stats: {
                total,
                unreadCount,
                readCount: total - unreadCount,
            },
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const notificationId = parseId(req.params.id);
    if (!notificationId) throw new AppError('Invalid notification id', 400, 'INVALID_PAYLOAD');

    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
    if (notification.userId !== req.user.id) {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });

    res.status(200).json({
        success: true,
        code: 'NOTIFICATION_MARKED_READ',
        message: 'Notification marked as read',
        data: { notification: updated },
    });
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const result = await prisma.notification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true },
    });

    res.status(200).json({
        success: true,
        code: 'ALL_NOTIFICATIONS_MARKED_READ',
        message: `${result.count} notifications marked as read`,
        data: { updatedCount: result.count },
    });
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const notificationId = parseId(req.params.id);
    if (!notificationId) throw new AppError('Invalid notification id', 400, 'INVALID_PAYLOAD');

    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
    if (notification.userId !== req.user.id) {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    await prisma.notification.delete({
        where: { id: notificationId },
    });

    res.status(200).json({
        success: true,
        code: 'NOTIFICATION_DELETED',
        message: 'Notification deleted successfully',
    });
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
    const result = await prisma.notification.deleteMany({
        where: { userId: req.user.id },
    });

    res.status(200).json({
        success: true,
        code: 'ALL_NOTIFICATIONS_DELETED',
        message: `${result.count} notifications deleted successfully`,
        data: { deletedCount: result.count },
    });
});

export const getUnreadNotificationsCount = asyncHandler(async (req, res) => {
    const unreadCount = await prisma.notification.count({
        where: { userId: req.user.id, isRead: false },
    });

    res.status(200).json({
        success: true,
        code: 'UNREAD_COUNT_RETRIEVED',
        message: 'Unread notifications count retrieved',
        data: { unreadCount },
    });
});
