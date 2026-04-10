import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

export const getPatientAccessHistory = asyncHandler(async (req, res) => {
    if (req.user.role !== 'patient') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const patientId = parseId(req.params.id);
    if (!patientId) throw new AppError('Invalid patient id', 400, 'INVALID_PAYLOAD');

    // Verify patient owns this data
    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        select: { userId: true },
    });

    if (!patient) throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    if (patient.userId !== req.user.id) {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [accessLogs, total] = await Promise.all([
        prisma.accessLog.findMany({
            where: { patientId },
            orderBy: { timestamp: 'desc' },
            skip,
            take: safeLimit,
            include: {
                accessedBy: { select: { id: true, name: true, email: true, role: true } },
            },
        }),
        prisma.accessLog.count({ where: { patientId } }),
    ]);

    res.status(200).json({
        success: true,
        code: 'PATIENT_ACCESS_HISTORY_RETRIEVED',
        message: 'Patient access history retrieved successfully',
        data: {
            accessLogs,
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    });
});

export const blockAccessToDoctor = asyncHandler(async (req, res) => {
    if (req.user.role !== 'patient') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const patientId = parseId(req.params.id);
    if (!patientId) throw new AppError('Invalid patient id', 400, 'INVALID_PAYLOAD');

    const doctorId = parseId(req.body.doctorId);
    if (!doctorId) throw new AppError('Invalid doctor id', 400, 'INVALID_PAYLOAD');

    // Verify patient owns this data
    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        select: { userId: true },
    });

    if (!patient) throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    if (patient.userId !== req.user.id) {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Revoke access: set isActive to false
    const grant = await prisma.patientAccessGrant.findUnique({
        where: { patientId_doctorId: { patientId, doctorId } },
    });

    if (!grant) {
        throw new AppError('Access grant not found', 404, 'ACCESS_GRANT_NOT_FOUND');
    }

    const updated = await prisma.patientAccessGrant.update({
        where: { id: grant.id },
        data: { isActive: false },
        include: { doctor: { include: { user: true } } },
    });

    res.status(200).json({
        success: true,
        code: 'ACCESS_BLOCKED',
        message: 'Access to this doctor has been blocked successfully',
        data: { grant: updated },
    });
});
