import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as PatientAccess from '../models/PatientAccess.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

const canAccessPatientScope = async ({ user, patientId, requiredScope }) => {
    if (user.role === 'admin') return true;

    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        select: { userId: true },
    });

    if (!patient) return { ok: false, reason: 'patient_not_found' };

    if (user.role === 'patient') {
        return user.id === patient.userId;
    }

    if (user.role === 'doctor') {
        const scopes = await PatientAccess.getActiveGrantScopesForDoctor({
            patientId,
            doctorUserId: user.id,
        });

        return PatientAccess.scopesAllow(scopes, requiredScope);
    }

    return false;
};

export const getPatientProfile = asyncHandler(async (req, res) => {
    const patientId = parseId(req.params.id);
    if (!patientId) throw new AppError('Invalid patient id', 400, 'INVALID_PAYLOAD');

    const allowed = await canAccessPatientScope({ user: req.user, patientId, requiredScope: 'profile' });
    if (allowed && typeof allowed === 'object' && allowed.reason === 'patient_not_found') {
        throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }
    if (!allowed) {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true, imageUrl: true } },
        },
    });

    if (!patient) throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');

    res.status(200).json({
        success: true,
        code: 'PATIENT_PROFILE_RETRIEVED',
        message: 'Patient profile retrieved successfully',
        data: { patient },
    });
});

export const getPatientAllergies = asyncHandler(async (req, res) => {
    const patientId = parseId(req.params.id);
    if (!patientId) throw new AppError('Invalid patient id', 400, 'INVALID_PAYLOAD');

    const allowed = await canAccessPatientScope({ user: req.user, patientId, requiredScope: 'allergies' });
    if (allowed && typeof allowed === 'object' && allowed.reason === 'patient_not_found') {
        throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }
    if (!allowed) throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');

    const allergies = await prisma.allergy.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
        success: true,
        code: 'PATIENT_ALLERGIES_RETRIEVED',
        message: 'Patient allergies retrieved successfully',
        data: { allergies },
    });
});

export const getPatientMedicalConditions = asyncHandler(async (req, res) => {
    const patientId = parseId(req.params.id);
    if (!patientId) throw new AppError('Invalid patient id', 400, 'INVALID_PAYLOAD');

    const allowed = await canAccessPatientScope({ user: req.user, patientId, requiredScope: 'medical_conditions' });
    if (allowed && typeof allowed === 'object' && allowed.reason === 'patient_not_found') {
        throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }
    if (!allowed) throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');

    const medicalConditions = await prisma.medicalCondition.findMany({
        where: { patientId },
        orderBy: { diagnosisDate: 'desc' },
    });

    res.status(200).json({
        success: true,
        code: 'PATIENT_MEDICAL_CONDITIONS_RETRIEVED',
        message: 'Patient medical conditions retrieved successfully',
        data: { medicalConditions },
    });
});

export const getPatientMedications = asyncHandler(async (req, res) => {
    const patientId = parseId(req.params.id);
    if (!patientId) throw new AppError('Invalid patient id', 400, 'INVALID_PAYLOAD');

    const allowed = await canAccessPatientScope({ user: req.user, patientId, requiredScope: 'medications' });
    if (allowed && typeof allowed === 'object' && allowed.reason === 'patient_not_found') {
        throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }
    if (!allowed) throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');

    const medications = await prisma.patientMedication.findMany({
        where: { patientId },
        orderBy: { startDate: 'desc' },
        include: { drug: true },
    });

    res.status(200).json({
        success: true,
        code: 'PATIENT_MEDICATIONS_RETRIEVED',
        message: 'Patient medications retrieved successfully',
        data: { medications },
    });
});

export const getPatientPrescriptions = asyncHandler(async (req, res) => {
    const patientId = parseId(req.params.id);
    if (!patientId) throw new AppError('Invalid patient id', 400, 'INVALID_PAYLOAD');

    const allowed = await canAccessPatientScope({ user: req.user, patientId, requiredScope: 'prescriptions' });
    if (allowed && typeof allowed === 'object' && allowed.reason === 'patient_not_found') {
        throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }
    if (!allowed) throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');

    const prescriptions = await prisma.prescription.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        include: {
            doctor: { include: { user: true } },
            pharmacist: { include: { user: true } },
            items: { include: { drug: true } },
        },
    });

    res.status(200).json({
        success: true,
        code: 'PATIENT_PRESCRIPTIONS_RETRIEVED',
        message: 'Patient prescriptions retrieved successfully',
        data: { prescriptions },
    });
});
