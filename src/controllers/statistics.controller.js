import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * Get overview statistics for current user based on their role
 */
export const getOverview = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    let stats = {};

    if (role === 'patient') {
        stats = await getPatientOverview(userId);
    } else if (role === 'doctor') {
        stats = await getDoctorOverview(userId);
    } else if (role === 'pharmacist') {
        stats = await getPharmacistOverview(userId);
    } else if (role === 'admin') {
        stats = await getAdminOverview();
    }

    res.status(200).json({
        success: true,
        code: 'OVERVIEW_RETRIEVED',
        message: `${role} overview retrieved successfully`,
        data: { stats },
    });
});

/**
 * Get patient-specific statistics
 */
async function getPatientOverview(userId) {
    const [
        accessRequestsReceived,
        activeGrants,
        prescriptions,
        notifications,
        allergies,
        medications,
    ] = await Promise.all([
        prisma.patientAccessRequest.count({
            where: { patient: { userId }, status: 'pending' },
        }),
        prisma.patientAccessGrant.count({
            where: { patient: { userId }, isActive: true },
        }),
        prisma.prescription.count({
            where: { patient: { userId } },
        }),
        prisma.notification.count({
            where: { userId },
        }),
        prisma.allergy.count({
            where: { patient: { userId } },
        }),
        prisma.patientMedication.count({
            where: { patient: { userId } },
        }),
    ]);

    const unreadNotifications = await prisma.notification.count({
        where: { userId, isRead: false },
    });

    return {
        role: 'patient',
        accessRequests: {
            pending: accessRequestsReceived,
            active: activeGrants,
        },
        prescriptions,
        medicalData: {
            allergies,
            medications,
        },
        notifications: {
            total: notifications,
            unread: unreadNotifications,
        },
    };
}

/**
 * Get doctor-specific statistics
 */
async function getDoctorOverview(userId) {
    const [
        accessRequestsSent,
        activeGrants,
        prescriptionsCreated,
        notifications,
    ] = await Promise.all([
        prisma.patientAccessRequest.count({
            where: { doctor: { userId } },
        }),
        prisma.patientAccessGrant.count({
            where: { doctor: { userId }, isActive: true },
        }),
        prisma.prescription.count({
            where: { doctor: { userId } },
        }),
        prisma.notification.count({
            where: { userId },
        }),
    ]);

    const accessRequestsPending = await prisma.patientAccessRequest.count({
        where: { doctor: { userId }, status: 'pending' },
    });

    const accessRequestsApproved = await prisma.patientAccessRequest.count({
        where: { doctor: { userId }, status: 'approved' },
    });

    const unreadNotifications = await prisma.notification.count({
        where: { userId, isRead: false },
    });

    return {
        role: 'doctor',
        accessRequests: {
            total: accessRequestsSent,
            pending: accessRequestsPending,
            approved: accessRequestsApproved,
            activeGrants,
        },
        prescriptions: prescriptionsCreated,
        notifications: {
            total: notifications,
            unread: unreadNotifications,
        },
    };
}

/**
 * Get pharmacist-specific statistics
 */
async function getPharmacistOverview(userId) {
    const [
        drugRequestsReceived,
        prescriptionFills,
        notifications,
    ] = await Promise.all([
        prisma.drugRequest.count({
            where: { status: 'open' },
        }),
        prisma.prescription.count({
            where: { status: 'filled' },
        }),
        prisma.notification.count({
            where: { userId },
        }),
    ]);

    const drugRequestsPending = await prisma.drugRequest.count({
        where: { status: 'open' },
    });

    const pharmacistResponses = await prisma.pharmacyResponse.count({
        where: { pharmacist: { userId } },
    });

    const unreadNotifications = await prisma.notification.count({
        where: { userId, isRead: false },
    });

    return {
        role: 'pharmacist',
        drugRequests: {
            total: drugRequestsReceived,
            pending: drugRequestsPending,
        },
        responses: pharmacistResponses,
        prescriptionFills,
        notifications: {
            total: notifications,
            unread: unreadNotifications,
        },
    };
}

/**
 * Get admin-specific statistics
 */
async function getAdminOverview() {
    const [
        totalUsers,
        pendingDoctors,
        pendingPharmacists,
        activeDoctors,
        activePharmacists,
        patients,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: { role: 'doctor', status: 'pending' },
        }),
        prisma.user.count({
            where: { role: 'pharmacist', status: 'pending' },
        }),
        prisma.user.count({
            where: { role: 'doctor', status: 'active' },
        }),
        prisma.user.count({
            where: { role: 'pharmacist', status: 'active' },
        }),
        prisma.user.count({
            where: { role: 'patient' },
        }),
    ]);

    const sessions = await prisma.session.count();
    const totalNotifications = await prisma.notification.count();

    return {
        role: 'admin',
        users: {
            total: totalUsers,
            patients,
            doctors: {
                total: activeDoctors + pendingDoctors,
                active: activeDoctors,
                pending: pendingDoctors,
            },
            pharmacists: {
                total: activePharmacists + pendingPharmacists,
                active: activePharmacists,
                pending: pendingPharmacists,
            },
        },
        sessions,
        notifications: totalNotifications,
        approvalsPending: pendingDoctors + pendingPharmacists,
    };
}

/**
 * Get detailed statistics for specific role
 */
export const getDetailedStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    let detailedStats = {};

    if (role === 'patient') {
        detailedStats = await getPatientDetailedStats(userId);
    } else if (role === 'doctor') {
        detailedStats = await getDoctorDetailedStats(userId);
    } else if (role === 'pharmacist') {
        detailedStats = await getPharmacistDetailedStats(userId);
    } else if (role === 'admin') {
        detailedStats = await getAdminDetailedStats();
    }

    res.status(200).json({
        success: true,
        code: 'DETAILED_STATS_RETRIEVED',
        message: 'Detailed statistics retrieved successfully',
        data: { stats: detailedStats },
    });
});

async function getPatientDetailedStats(userId) {
    const patient = await prisma.patient.findUnique({
        where: { userId },
        include: { user: true },
    });

    if (!patient) {
        throw new AppError('Patient profile not found', 404, 'PATIENT_NOT_FOUND');
    }

    const [accessRequestBreakdown, grantsWithDoctors] = await Promise.all([
        prisma.patientAccessRequest.groupBy({
            by: ['status'],
            where: { patientUserId: userId },
            _count: true,
        }),
        prisma.patientAccessGrant.findMany({
            where: { patientId: patient.id, isActive: true },
            include: {
                doctor: { include: { user: true } },
            },
            take: 10,
        }),
    ]);

    return {
        profile: {
            name: patient.user.name,
            email: patient.user.email,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
        },
        accessRequests: accessRequestBreakdown.map((item) => ({
            status: item.status,
            count: item._count,
        })),
        activeDocsWithAccess: grantsWithDoctors.map((grant) => ({
            doctorId: grant.doctorId,
            name: grant.doctor.user.name,
            specialization: grant.doctor.specialization,
            grantedAt: grant.grantedAt,
            expiresAt: grant.expiresAt,
        })),
    };
}

async function getDoctorDetailedStats(userId) {
    const doctor = await prisma.doctor.findUnique({
        where: { userId },
        include: { user: true },
    });

    if (!doctor) {
        throw new AppError('Doctor profile not found', 404, 'DOCTOR_NOT_FOUND');
    }

    const [requestBreakdown, recentPrescriptions] = await Promise.all([
        prisma.patientAccessRequest.groupBy({
            by: ['status'],
            where: { doctorUserId: userId },
            _count: true,
        }),
        prisma.prescription.findMany({
            where: { doctor: { userId } },
            include: { patient: { include: { user: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10,
        }),
    ]);

    return {
        profile: {
            name: doctor.user.name,
            email: doctor.user.email,
            specialization: doctor.specialization,
            clinicName: doctor.clinicName,
        },
        accessRequests: requestBreakdown.map((item) => ({
            status: item.status,
            count: item._count,
        })),
        recentPrescriptions: recentPrescriptions.map((prescript) => ({
            id: prescript.id,
            patientName: prescript.patient.user.name,
            medication: prescript.medication,
            createdAt: prescript.createdAt,
        })),
    };
}

async function getPharmacistDetailedStats(userId) {
    const pharmacist = await prisma.pharmacist.findUnique({
        where: { userId },
        include: { user: true },
    });

    if (!pharmacist) {
        throw new AppError('Pharmacist profile not found', 404, 'PHARMACIST_NOT_FOUND');
    }

    const [requestBreakdown, recentResponses] = await Promise.all([
        prisma.drugRequest.groupBy({
            by: ['status'],
            _count: true,
        }),
        prisma.pharmacyResponse.findMany({
            where: { pharmacistId: pharmacist.id },
            include: {
                drugRequest: {
                    include: {
                        drug: true,
                        patient: { include: { user: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        }),
    ]);

    return {
        profile: {
            name: pharmacist.user.name,
            email: pharmacist.user.email,
            pharmacyName: pharmacist.pharmacyName,
            city: pharmacist.city,
        },
        drugRequests: requestBreakdown.map((item) => ({
            status: item.status,
            count: item._count,
        })),
        recentResponses: recentResponses.map((resp) => ({
            id: resp.id,
            patientName: resp.drugRequest.patient.user.name,
            drugName: resp.drugRequest.drug.name,
            available: resp.available,
            respondedAt: resp.createdAt,
        })),
    };
}

async function getAdminDetailedStats() {
    const [
        usersByRole,
        usersByStatus,
        recentUsers,
        prescriptionStats,
    ] = await Promise.all([
        prisma.user.groupBy({
            by: ['role'],
            _count: true,
        }),
        prisma.user.groupBy({
            by: ['status'],
            _count: true,
        }),
        prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        }),
        prisma.prescription.groupBy({
            by: ['status'],
            _count: true,
        }),
    ]);

    return {
        userStats: {
            byRole: usersByRole.map((item) => ({
                role: item.role,
                count: item._count,
            })),
            byStatus: usersByStatus.map((item) => ({
                status: item.status,
                count: item._count,
            })),
        },
        prescriptionStats: prescriptionStats.map((item) => ({
            status: item.status,
            count: item._count,
        })),
        recentUsers,
    };
}
