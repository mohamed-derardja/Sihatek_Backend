import prisma from '../config/prisma.js';
import crypto from 'crypto';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

export const getDoctorIdByUserId = async (userId) => {
    const userIdInt = parseId(userId);
    if (!userIdInt) return null;

    const existing = await prisma.doctor.findUnique({
        where: { userId: userIdInt },
        select: { id: true },
    });
    if (existing?.id) return existing.id;

    // Auto-create minimal doctor profile if missing (useful for testing).
    // Required fields: specialization, licenseNumber
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

    // Auto-create minimal patient profile if missing.
    const created = await prisma.patient.create({
        data: { userId: userIdInt },
        select: { id: true },
    });
    return created.id;
};

export const getPharmacistIdByUserId = async (userId) => {
    const userIdInt = parseId(userId);
    if (!userIdInt) return null;

    const existing = await prisma.pharmacist.findUnique({
        where: { userId: userIdInt },
        select: { id: true },
    });
    if (existing?.id) return existing.id;

    // Auto-create minimal pharmacist profile if missing (useful for testing).
    // Required fields: pharmacyName, licenseNumber, location
    const created = await prisma.pharmacist.create({
        data: {
            userId: userIdInt,
            pharmacyName: `Auto Pharmacy ${userIdInt}`,
            licenseNumber: `AUTO-PHARM-${userIdInt}`,
            location: 'Unknown',
        },
        select: { id: true },
    });
    return created.id;
};

export const consumePatientAccessCode = async ({
    patientId,
    code,
    roleAllowed,
    requiredAction,
    accessedByUserId,
}) => {
    const normalizedCode = typeof code === 'string' ? code.trim() : '';
    if (!normalizedCode) {
        return { ok: false, reason: 'missing' };
    }

    const patientIdInt = parseId(patientId);
    if (!patientIdInt) {
        return { ok: false, reason: 'invalid_patient' };
    }

    const accessCode = await prisma.accessCode.findUnique({
        where: { code: normalizedCode },
    });

    if (!accessCode) {
        return { ok: false, reason: 'not_found' };
    }

    if (accessCode.patientId !== patientIdInt) {
        return { ok: false, reason: 'patient_mismatch' };
    }

    if (accessCode.roleAllowed !== roleAllowed) {
        return { ok: false, reason: 'role_mismatch' };
    }

    if (accessCode.expiresAt && accessCode.expiresAt.getTime() <= Date.now()) {
        return { ok: false, reason: 'expired' };
    }

    if (accessCode.isUsed) {
        return { ok: false, reason: 'used' };
    }

    // If a code is created for `edit`, allow it for `view` as well.
    const actionOk =
        requiredAction === 'view'
            ? ['view', 'edit'].includes(accessCode.action)
            : accessCode.action === 'edit';

    if (!actionOk) {
        return { ok: false, reason: 'action_mismatch' };
    }

    await prisma.$transaction(async (tx) => {
        await tx.accessCode.update({
            where: { id: accessCode.id },
            data: { isUsed: true },
        });

        await tx.accessLog.create({
            data: {
                patientId: patientIdInt,
                accessedById: accessedByUserId,
                role: roleAllowed,
                accessType: requiredAction,
                accessCodeId: accessCode.id,
            },
        });
    });

    return { ok: true };
};

export const createPrescription = async ({
    doctorUserId,
    patientId,
    patientUserId,
    guestPatientId,
    pharmacistId,
    pharmacistUserId,
    items,
    expiresAt,
}) => {
    const doctorId = await getDoctorIdByUserId(doctorUserId);
    if (!doctorId) {
        return { ok: false, reason: 'doctor_not_found' };
    }

    let patientIdInt = patientId ? parseId(patientId) : null;
    if (!patientIdInt && patientUserId) {
        const patientUserIdInt = parseId(patientUserId);
        if (!patientUserIdInt) return { ok: false, reason: 'invalid_patient_user' };
        patientIdInt = await getPatientIdByUserId(patientUserIdInt);
    }
    const guestPatientIdInt = guestPatientId ? parseId(guestPatientId) : null;
    let pharmacistIdInt = pharmacistId ? parseId(pharmacistId) : null;
    if (!pharmacistIdInt && pharmacistUserId) {
        const pharmacistUserIdInt = parseId(pharmacistUserId);
        if (!pharmacistUserIdInt) return { ok: false, reason: 'invalid_pharmacist_user' };
        pharmacistIdInt = await getPharmacistIdByUserId(pharmacistUserIdInt);
    }

    if (!patientIdInt && !guestPatientIdInt) {
        return { ok: false, reason: 'missing_patient' };
    }

    if (!Array.isArray(items) || items.length === 0) {
        return { ok: false, reason: 'missing_items' };
    }

    if (patientIdInt) {
        const patient = await prisma.patient.findUnique({ where: { id: patientIdInt } });
        if (!patient) return { ok: false, reason: 'patient_not_found' };
    }

    if (guestPatientIdInt) {
        const guest = await prisma.guestPatient.findUnique({ where: { id: guestPatientIdInt } });
        if (!guest) return { ok: false, reason: 'guest_patient_not_found' };
    }

    if (pharmacistIdInt) {
        const pharmacist = await prisma.pharmacist.findUnique({ where: { id: pharmacistIdInt } });
        if (!pharmacist) return { ok: false, reason: 'pharmacist_not_found' };
    }

    const created = await prisma.prescription.create({
        data: {
            doctorId,
            patientId: patientIdInt,
            guestPatientId: guestPatientIdInt,
            pharmacistId: pharmacistIdInt,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            items: {
                create: items.map((it) => ({
                    drugId: parseId(it.drugId),
                    dosage: String(it.dosage || '').trim(),
                    frequency: String(it.frequency || '').trim(),
                    duration: String(it.duration || '').trim(),
                    instructions: it.instructions !== undefined && it.instructions !== null ? String(it.instructions).trim() : null,
                })),
            },
        },
        include: {
            items: {
                include: {
                    drug: true,
                },
            },
        },
    });

    return { ok: true, prescription: created };
};

export const getPrescriptionsByDoctorUserId = async (doctorUserId, page = 1, limit = 20) => {
    const doctorId = await getDoctorIdByUserId(doctorUserId);
    if (!doctorId) return { ok: false, reason: 'doctor_not_found' };

    const skip = (page - 1) * limit;
    const [prescriptions, total] = await Promise.all([
        prisma.prescription.findMany({
            where: { doctorId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                items: { include: { drug: true } },
                patient: { include: { user: true } },
                guestPatient: true,
                pharmacist: { include: { user: true } },
            },
        }),
        prisma.prescription.count({ where: { doctorId } }),
    ]);

    return { ok: true, data: { prescriptions, total, pages: Math.ceil(total / limit), currentPage: page } };
};

export const getPrescriptionsByPatientUserId = async (patientUserId, page = 1, limit = 20) => {
    const patientId = await getPatientIdByUserId(patientUserId);
    if (!patientId) return { ok: false, reason: 'patient_not_found' };

    const skip = (page - 1) * limit;
    const [prescriptions, total] = await Promise.all([
        prisma.prescription.findMany({
            where: { patientId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                items: { include: { drug: true } },
                doctor: { include: { user: true } },
                pharmacist: { include: { user: true } },
            },
        }),
        prisma.prescription.count({ where: { patientId } }),
    ]);

    return { ok: true, data: { prescriptions, total, pages: Math.ceil(total / limit), currentPage: page } };
};

export const getPrescriptionsByPatientId = async ({ patientId, page = 1, limit = 20, pharmacistUserId }) => {
    const patientIdInt = parseId(patientId);
    if (!patientIdInt) return { ok: false, reason: 'invalid_patient' };

    let pharmacistId = null;
    if (pharmacistUserId) {
        pharmacistId = await getPharmacistIdByUserId(pharmacistUserId);
        if (!pharmacistId) return { ok: false, reason: 'pharmacist_not_found' };
    }

    const skip = (page - 1) * limit;
    const where = pharmacistId
        ? { patientId: patientIdInt, pharmacistId }
        : { patientId: patientIdInt };

    const [prescriptions, total] = await Promise.all([
        prisma.prescription.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                items: { include: { drug: true } },
                doctor: { include: { user: true } },
                pharmacist: { include: { user: true } },
            },
        }),
        prisma.prescription.count({ where }),
    ]);

    return { ok: true, data: { prescriptions, total, pages: Math.ceil(total / limit), currentPage: page } };
};

export const getPrescriptionById = async (id) => {
    const prescriptionId = parseId(id);
    if (!prescriptionId) return null;

    return await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
            items: { include: { drug: true } },
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
            guestPatient: true,
            pharmacist: { include: { user: true } },
        },
    });
};

export const updatePrescriptionStatus = async (id, status) => {
    const prescriptionId = parseId(id);
    if (!prescriptionId) return null;

    return await prisma.prescription.update({
        where: { id: prescriptionId },
        data: { status },
        include: {
            items: { include: { drug: true } },
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
            guestPatient: true,
            pharmacist: { include: { user: true } },
        },
    });
};

export const createPatientAccessCode = async ({ patientUserId, roleAllowed, action, expiresInMinutes = 60 }) => {
    const patientId = await getPatientIdByUserId(patientUserId);
    if (!patientId) return { ok: false, reason: 'patient_not_found' };

    const minutes = Number.parseInt(expiresInMinutes, 10);
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 60 * 24 * 30) {
        return { ok: false, reason: 'invalid_expiry' };
    }

    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    // Generate a short unique code
    for (let attempt = 0; attempt < 5; attempt++) {
        const code = crypto.randomBytes(5).toString('hex'); // 10 chars
        try {
            const created = await prisma.accessCode.create({
                data: {
                    patientId,
                    roleAllowed,
                    code,
                    expiresAt,
                    action,
                },
                select: {
                    id: true,
                    code: true,
                    roleAllowed: true,
                    action: true,
                    expiresAt: true,
                    isUsed: true,
                },
            });
            return { ok: true, accessCode: created };
        } catch (e) {
            // If collision occurs, retry; otherwise surface as failure.
            if (e?.code !== 'P2002') {
                return { ok: false, reason: 'create_failed' };
            }
        }
    }

    return { ok: false, reason: 'code_generation_failed' };
};
