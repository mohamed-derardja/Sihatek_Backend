import prisma from '../config/prisma.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

export const listGuestPatientsByCreatorUserId = async ({ creatorUserId, page = 1, limit = 20 }) => {
    const creatorUserIdInt = parseId(creatorUserId);
    if (!creatorUserIdInt) return { ok: false, reason: 'invalid_creator' };

    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
        prisma.guestPatient.findMany({
            where: { createdById: creatorUserIdInt },
            orderBy: { createdAt: 'desc' },
            skip,
            take: safeLimit,
        }),
        prisma.guestPatient.count({ where: { createdById: creatorUserIdInt } }),
    ]);

    return {
        ok: true,
        data: {
            items,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                pages: Math.ceil(total / safeLimit),
            },
        },
    };
};

export const getGuestPatientById = async ({ id }) => {
    const idInt = parseId(id);
    if (!idInt) return null;

    return prisma.guestPatient.findUnique({
        where: { id: idInt },
    });
};

export const createGuestPatient = async ({ creatorUserId, payload }) => {
    const creatorUserIdInt = parseId(creatorUserId);
    if (!creatorUserIdInt) return { ok: false, reason: 'invalid_creator' };

    const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
    if (!name) return { ok: false, reason: 'missing_name' };

    const data = {
        name,
        createdById: creatorUserIdInt,
        email: typeof payload.email === 'string' && payload.email.trim() ? payload.email.trim() : null,
        phone: typeof payload.phone === 'string' && payload.phone.trim() ? payload.phone.trim() : null,
        gender: payload.gender || null,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
        bloodType: typeof payload.bloodType === 'string' && payload.bloodType.trim() ? payload.bloodType.trim() : null,
        height: payload.height !== undefined && payload.height !== null ? Number(payload.height) : null,
        weight: payload.weight !== undefined && payload.weight !== null ? Number(payload.weight) : null,
    };

    const created = await prisma.guestPatient.create({ data });
    return { ok: true, guestPatient: created };
};

export const updateGuestPatient = async ({ id, creatorUserId, payload }) => {
    const idInt = parseId(id);
    const creatorUserIdInt = parseId(creatorUserId);
    if (!idInt || !creatorUserIdInt) return { ok: false, reason: 'invalid' };

    const existing = await prisma.guestPatient.findUnique({ where: { id: idInt } });
    if (!existing) return { ok: false, reason: 'not_found' };
    if (existing.createdById !== creatorUserIdInt) return { ok: false, reason: 'forbidden' };

    const data = {};
    if (payload.name !== undefined) {
        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        if (!name) return { ok: false, reason: 'missing_name' };
        data.name = name;
    }
    if (payload.email !== undefined) data.email = payload.email ? String(payload.email).trim() : null;
    if (payload.phone !== undefined) data.phone = payload.phone ? String(payload.phone).trim() : null;
    if (payload.gender !== undefined) data.gender = payload.gender || null;
    if (payload.dateOfBirth !== undefined) data.dateOfBirth = payload.dateOfBirth ? new Date(payload.dateOfBirth) : null;
    if (payload.bloodType !== undefined) data.bloodType = payload.bloodType ? String(payload.bloodType).trim() : null;
    if (payload.height !== undefined) data.height = payload.height !== null ? Number(payload.height) : null;
    if (payload.weight !== undefined) data.weight = payload.weight !== null ? Number(payload.weight) : null;

    const updated = await prisma.guestPatient.update({ where: { id: idInt }, data });
    return { ok: true, guestPatient: updated };
};

export const deleteGuestPatient = async ({ id, creatorUserId }) => {
    const idInt = parseId(id);
    const creatorUserIdInt = parseId(creatorUserId);
    if (!idInt || !creatorUserIdInt) return { ok: false, reason: 'invalid' };

    const existing = await prisma.guestPatient.findUnique({ where: { id: idInt } });
    if (!existing) return { ok: false, reason: 'not_found' };
    if (existing.createdById !== creatorUserIdInt) return { ok: false, reason: 'forbidden' };

    await prisma.guestPatient.delete({ where: { id: idInt } });
    return { ok: true };
};
