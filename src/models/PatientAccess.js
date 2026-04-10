import prisma from '../config/prisma.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

const ALLOWED_SCOPES = new Set([
    'profile',
    'allergies',
    'medical_conditions',
    'medications',
    'prescriptions',
    'drug_requests',
    'all',
]);

// Calculate expiry date based on days from now
export const calculateExpiryDate = (durationDays) => {
    if (!durationDays || Number.isNaN(Number(durationDays))) return null;
    const days = Number.parseInt(durationDays, 10);
    if (days <= 0) return null;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    return expiresAt;
};

// Check if access grant is still valid (not expired)
export const isGrantValid = (grant) => {
    if (!grant || !grant.isActive) return false;
    if (!grant.expiresAt) return true; // No expiry = valid indefinitely
    return new Date() < new Date(grant.expiresAt);
};

export const normalizeScopes = (scopes) => {
    if (!Array.isArray(scopes) || scopes.length === 0) return null;

    const normalized = [...new Set(scopes.map((s) => String(s).trim()).filter(Boolean))].filter((s) => ALLOWED_SCOPES.has(s));
    if (normalized.length === 0) return null;

    // If 'all' is present, store only 'all' to avoid ambiguity.
    if (normalized.includes('all')) return ['all'];

    return normalized;
};

export const scopesAllow = (grantScopes, requiredScope) => {
    if (!Array.isArray(grantScopes)) return false;
    if (grantScopes.includes('all')) return true;
    return grantScopes.includes(requiredScope);
};

export const getDoctorIdByUserId = async (userId) => {
    const userIdInt = parseId(userId);
    if (!userIdInt) return null;

    const existing = await prisma.doctor.findUnique({
        where: { userId: userIdInt },
        select: { id: true },
    });

    if (existing?.id) return existing.id;

    // Auto-create minimal doctor profile (useful for testing).
    const created = await prisma.doctor.create({
        data: {
            userId: userIdInt,
            specialization: 'General',
            licenseNumber: `AUTO-DOCTOR-${userIdInt}`,
        },
        select: { id: true },
    });

    return created.id;
};

export const getPatientIdByUserId = async (userId) => {
    const userIdInt = parseId(userId);
    if (!userIdInt) return null;

    const existing = await prisma.patient.findUnique({
        where: { userId: userIdInt },
        select: { id: true },
    });

    if (existing?.id) return existing.id;

    // Auto-create minimal patient profile (useful for testing).
    const created = await prisma.patient.create({
        data: { userId: userIdInt },
        select: { id: true },
    });

    return created.id;
};

export const createOrUpdateAccessRequest = async ({ doctorUserId, patientId, patientUserId, scopes, message, durationDays }) => {
    const doctorId = await getDoctorIdByUserId(doctorUserId);
    if (!doctorId) return { ok: false, reason: 'doctor_not_found' };

    let patientIdInt = patientId ? parseId(patientId) : null;
    if (!patientIdInt && patientUserId) {
        patientIdInt = await getPatientIdByUserId(patientUserId);
    }
    if (!patientIdInt) return { ok: false, reason: 'patient_not_found' };

    const normalizedScopes = normalizeScopes(scopes);
    if (!normalizedScopes) return { ok: false, reason: 'invalid_scopes' };

    const requestedExpiresAt = calculateExpiryDate(durationDays);

    const existingPending = await prisma.patientAccessRequest.findFirst({
        where: {
            patientId: patientIdInt,
            doctorId,
            status: 'pending',
        },
        orderBy: { createdAt: 'desc' },
    });

    const request = existingPending
        ? await prisma.patientAccessRequest.update({
              where: { id: existingPending.id },
              data: {
                  scopes: normalizedScopes,
                  message: typeof message === 'string' && message.trim() ? message.trim() : existingPending.message,
                  requestedExpiresAt,
              },
              include: {
                  patient: { include: { user: true } },
                  doctor: { include: { user: true } },
              },
          })
        : await prisma.patientAccessRequest.create({
              data: {
                  patientId: patientIdInt,
                  doctorId,
                  scopes: normalizedScopes,
                  message: typeof message === 'string' && message.trim() ? message.trim() : null,
                  requestedExpiresAt,
              },
              include: {
                  patient: { include: { user: true } },
                  doctor: { include: { user: true } },
              },
          });

    return { ok: true, request };
};

export const listRequestsSentByDoctorUserId = async ({ doctorUserId, page = 1, limit = 20 }) => {
    const doctorId = await getDoctorIdByUserId(doctorUserId);
    if (!doctorId) return { ok: false, reason: 'doctor_not_found' };

    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
        prisma.patientAccessRequest.findMany({
            where: { doctorId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: safeLimit,
            include: {
                patient: { include: { user: true } },
            },
        }),
        prisma.patientAccessRequest.count({ where: { doctorId } }),
    ]);

    return {
        ok: true,
        data: {
            items,
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    };
};

export const listRequestsReceivedByPatientUserId = async ({ patientUserId, page = 1, limit = 20 }) => {
    const patientId = await getPatientIdByUserId(patientUserId);
    if (!patientId) return { ok: false, reason: 'patient_not_found' };

    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
        prisma.patientAccessRequest.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: safeLimit,
            include: {
                doctor: { include: { user: true } },
            },
        }),
        prisma.patientAccessRequest.count({ where: { patientId } }),
    ]);

    return {
        ok: true,
        data: {
            items,
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    };
};

export const respondToRequestAsPatient = async ({ patientUserId, requestId, status, durationDays }) => {
    const patientId = await getPatientIdByUserId(patientUserId);
    if (!patientId) return { ok: false, reason: 'patient_not_found' };

    const requestIdInt = parseId(requestId);
    if (!requestIdInt) return { ok: false, reason: 'invalid_request' };

    const request = await prisma.patientAccessRequest.findUnique({
        where: { id: requestIdInt },
    });
    if (!request) return { ok: false, reason: 'not_found' };
    if (request.patientId !== patientId) return { ok: false, reason: 'forbidden' };

    const nextStatus = String(status || '').trim();
    if (!['approved', 'rejected'].includes(nextStatus)) return { ok: false, reason: 'invalid_status' };

    const updated = await prisma.$transaction(async (tx) => {
        const updatedRequest = await tx.patientAccessRequest.update({
            where: { id: requestIdInt },
            data: { status: nextStatus },
        });

        if (nextStatus === 'approved') {
            const scopes = Array.isArray(request.scopes) && request.scopes.includes('all') ? ['all'] : request.scopes;
            // Use durationDays from response or requestedExpiresAt from request
            const expiresAt = calculateExpiryDate(durationDays) || request.requestedExpiresAt;

            await tx.patientAccessGrant.upsert({
                where: { patientId_doctorId: { patientId: request.patientId, doctorId: request.doctorId } },
                create: {
                    patientId: request.patientId,
                    doctorId: request.doctorId,
                    scopes,
                    isActive: true,
                    expiresAt,
                },
                update: {
                    scopes,
                    isActive: true,
                    expiresAt,
                },
            });
        }

        return updatedRequest;
    });

    return { ok: true, request: updated };
};

export const listGrantsForPatientUserId = async ({ patientUserId }) => {
    const patientId = await getPatientIdByUserId(patientUserId);
    if (!patientId) return { ok: false, reason: 'patient_not_found' };

    const grants = await prisma.patientAccessGrant.findMany({
        where: { patientId },
        orderBy: { updatedAt: 'desc' },
        include: { doctor: { include: { user: true } } },
    });

    // Enhance grants with isValid and isExpired flags
    const enhancedGrants = grants.map((grant) => ({
        ...grant,
        isValid: isGrantValid(grant),
        isExpired: grant.expiresAt && new Date() >= new Date(grant.expiresAt),
    }));

    return { ok: true, grants: enhancedGrants };
};

export const revokeGrantAsPatient = async ({ patientUserId, doctorId }) => {
    const patientId = await getPatientIdByUserId(patientUserId);
    if (!patientId) return { ok: false, reason: 'patient_not_found' };

    const doctorIdInt = parseId(doctorId);
    if (!doctorIdInt) return { ok: false, reason: 'invalid_doctor' };

    const existing = await prisma.patientAccessGrant.findUnique({
        where: { patientId_doctorId: { patientId, doctorId: doctorIdInt } },
    });

    if (!existing) return { ok: false, reason: 'not_found' };

    const updated = await prisma.patientAccessGrant.update({
        where: { id: existing.id },
        data: { isActive: false },
    });

    return { ok: true, grant: updated };
};

export const getActiveGrantScopesForDoctor = async ({ patientId, doctorUserId }) => {
    const patientIdInt = parseId(patientId);
    if (!patientIdInt) return null;

    const doctorId = await getDoctorIdByUserId(doctorUserId);
    if (!doctorId) return null;

    const grant = await prisma.patientAccessGrant.findUnique({
        where: { patientId_doctorId: { patientId: patientIdInt, doctorId } },
        select: { scopes: true, isActive: true, expiresAt: true },
    });

    // Check if grant is valid (active and not expired)
    if (!isGrantValid(grant)) return null;
    return grant.scopes;
};
