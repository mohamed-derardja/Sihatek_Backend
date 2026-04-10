import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import prisma from '../config/prisma.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

// Get pending doctors
export const getPendingDoctors = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [doctors, total] = await Promise.all([
        prisma.user.findMany({
            where: { role: 'doctor', status: 'pending' },
            skip,
            take: safeLimit,
            orderBy: { createdAt: 'desc' },
            include: {
                doctor: true,
            },
        }),
        prisma.user.count({ where: { role: 'doctor', status: 'pending' } }),
    ]);

    res.status(200).json({
        success: true,
        code: 'PENDING_DOCTORS_RETRIEVED',
        message: 'Pending doctors retrieved successfully',
        data: {
            doctors,
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    });
});

// Accept doctor
export const acceptDoctor = asyncHandler(async (req, res) => {
    const userId = parseId(req.params.userId);
    if (!userId) throw new AppError('Invalid user ID', 400, 'INVALID_PAYLOAD');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { doctor: true },
    });

    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    if (user.role !== 'doctor') throw new AppError('User is not a doctor', 400, 'INVALID_PAYLOAD');

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { status: 'active' },
        include: { doctor: true },
    });

    res.status(200).json({
        success: true,
        code: 'DOCTOR_APPROVED',
        message: 'Doctor approved successfully',
        data: { user: updated },
    });
});

// Reject doctor
export const rejectDoctor = asyncHandler(async (req, res) => {
    const userId = parseId(req.params.userId);
    if (!userId) throw new AppError('Invalid user ID', 400, 'INVALID_PAYLOAD');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { doctor: true },
    });

    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    if (user.role !== 'doctor') throw new AppError('User is not a doctor', 400, 'INVALID_PAYLOAD');

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { status: 'rejected' },
        include: { doctor: true },
    });

    res.status(200).json({
        success: true,
        code: 'DOCTOR_REJECTED',
        message: 'Doctor rejected successfully',
        data: { user: updated },
    });
});

// Get pending pharmacies
export const getPendingPharmacies = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [pharmacies, total] = await Promise.all([
        prisma.user.findMany({
            where: { role: 'pharmacist', status: 'pending' },
            skip,
            take: safeLimit,
            orderBy: { createdAt: 'desc' },
            include: {
                pharmacist: true,
            },
        }),
        prisma.user.count({ where: { role: 'pharmacist', status: 'pending' } }),
    ]);

    res.status(200).json({
        success: true,
        code: 'PENDING_PHARMACIES_RETRIEVED',
        message: 'Pending pharmacies retrieved successfully',
        data: {
            pharmacies,
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    });
});

// Accept pharmacy
export const acceptPharmacy = asyncHandler(async (req, res) => {
    const userId = parseId(req.params.userId);
    if (!userId) throw new AppError('Invalid user ID', 400, 'INVALID_PAYLOAD');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { pharmacist: true },
    });

    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    if (user.role !== 'pharmacist') throw new AppError('User is not a pharmacist', 400, 'INVALID_PAYLOAD');

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { status: 'active' },
        include: { pharmacist: true },
    });

    res.status(200).json({
        success: true,
        code: 'PHARMACIST_APPROVED',
        message: 'Pharmacist approved successfully',
        data: { user: updated },
    });
});

// Reject pharmacy
export const rejectPharmacy = asyncHandler(async (req, res) => {
    const userId = parseId(req.params.userId);
    if (!userId) throw new AppError('Invalid user ID', 400, 'INVALID_PAYLOAD');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { pharmacist: true },
    });

    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    if (user.role !== 'pharmacist') throw new AppError('User is not a pharmacist', 400, 'INVALID_PAYLOAD');

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { status: 'rejected' },
        include: { pharmacist: true },
    });

    res.status(200).json({
        success: true,
        code: 'PHARMACIST_REJECTED',
        message: 'Pharmacist rejected successfully',
        data: { user: updated },
    });
});

// Get all pending approvals (doctors + pharmacies)
export const getPendingApprovals = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [approvals, total] = await Promise.all([
        prisma.user.findMany({
            where: {
                status: 'pending',
                role: { in: ['doctor', 'pharmacist'] },
            },
            skip,
            take: safeLimit,
            orderBy: { createdAt: 'desc' },
            include: {
                doctor: true,
                pharmacist: true,
            },
        }),
        prisma.user.count({
            where: {
                status: 'pending',
                role: { in: ['doctor', 'pharmacist'] },
            },
        }),
    ]);

    res.status(200).json({
        success: true,
        code: 'PENDING_APPROVALS_RETRIEVED',
        message: 'Pending approvals retrieved successfully',
        data: {
            approvals,
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    });
});
