import * as prescriptionModel from '../models/Prescription.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Errors } from '../errors/errors.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

// Doctor can create prescription
export const createPrescription = asyncHandler(async (req, res) => {
    const doctorUserId = req.user.id;

    const { patientId, patientUserId, guestPatientId, pharmacistId, pharmacistUserId, items, expiresAt } = req.body;

    const result = await prescriptionModel.createPrescription({
        doctorUserId,
        patientId,
        patientUserId,
        guestPatientId,
        pharmacistId,
        pharmacistUserId,
        items,
        expiresAt,
    });

    if (!result.ok) {
        throw Errors.INVALID_PAYLOAD();
    }

    res.status(201).json({
        success: true,
        code: 'PRESCRIPTION_CREATED',
        message: 'Prescription created successfully',
        data: { prescription: result.prescription },
    });
});

// Doctor: see prescriptions created by him
export const getMyDoctorPrescriptions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await prescriptionModel.getPrescriptionsByDoctorUserId(req.user.id, page, limit);
    if (!result.ok) {
        throw Errors.INVALID_PAYLOAD();
    }

    res.status(200).json({
        success: true,
        code: 'PRESCRIPTIONS_RETRIEVED',
        message: 'Prescriptions retrieved successfully',
        data: result.data,
    });
});

// Patient: see all his prescriptions
export const getMyPatientPrescriptions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await prescriptionModel.getPrescriptionsByPatientUserId(req.user.id, page, limit);
    if (!result.ok) {
        throw Errors.INVALID_PAYLOAD();
    }

    res.status(200).json({
        success: true,
        code: 'PRESCRIPTIONS_RETRIEVED',
        message: 'Prescriptions retrieved successfully',
        data: result.data,
    });
});

// Doctor/Pharmacist: see all prescriptions of a patient if patient gives access
export const getPatientPrescriptionsWithAccess = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const accessCode = req.query.accessCode;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const patientIdInt = parseId(patientId);
    if (!patientIdInt) {
        throw Errors.INVALID_PAYLOAD();
    }

    const roleAllowed = req.user.role;

    const consumed = await prescriptionModel.consumePatientAccessCode({
        patientId: patientIdInt,
        code: accessCode,
        roleAllowed,
        requiredAction: 'view',
        accessedByUserId: req.user.id,
    });

    if (!consumed.ok) {
        throw Errors.ACCESS_CODE_INVALID();
    }

    const pharmacistUserId = roleAllowed === 'pharmacist' ? req.user.id : null;

    const result = await prescriptionModel.getPrescriptionsByPatientId({
        patientId: patientIdInt,
        page,
        limit,
        pharmacistUserId,
    });

    if (!result.ok) {
        throw Errors.INVALID_PAYLOAD();
    }

    res.status(200).json({
        success: true,
        code: 'PRESCRIPTIONS_RETRIEVED',
        message: 'Prescriptions retrieved successfully',
        data: result.data,
    });
});

// Get prescription by ID with access rules
export const getPrescriptionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const accessCode = req.query.accessCode;

    const prescription = await prescriptionModel.getPrescriptionById(id);
    if (!prescription) {
        throw Errors.PRESCRIPTION_NOT_FOUND();
    }

    const role = req.user.role;

    // Patient can see all of his prescriptions
    if (role === 'patient') {
        if (!prescription.patient || prescription.patient.userId !== req.user.id) {
            throw Errors.INSUFFICIENT_PERMISSIONS();
        }
    }

    // Doctor can see prescriptions created by him
    if (role === 'doctor') {
        if (!prescription.doctor || prescription.doctor.userId !== req.user.id) {
            // Not his => only allowed if patient grants access
            if (!prescription.patientId) {
                throw Errors.INSUFFICIENT_PERMISSIONS();
            }

            const consumed = await prescriptionModel.consumePatientAccessCode({
                patientId: prescription.patientId,
                code: accessCode,
                roleAllowed: 'doctor',
                requiredAction: 'view',
                accessedByUserId: req.user.id,
            });

            if (!consumed.ok) {
                throw Errors.ACCESS_CODE_INVALID();
            }
        }
    }

    // Pharmacist can see only if patient grants access AND prescription is assigned to him
    if (role === 'pharmacist') {
        if (!prescription.patientId) {
            throw Errors.INSUFFICIENT_PERMISSIONS();
        }
        if (!prescription.pharmacist || prescription.pharmacist.userId !== req.user.id) {
            throw Errors.INSUFFICIENT_PERMISSIONS();
        }

        const consumed = await prescriptionModel.consumePatientAccessCode({
            patientId: prescription.patientId,
            code: accessCode,
            roleAllowed: 'pharmacist',
            requiredAction: 'view',
            accessedByUserId: req.user.id,
        });

        if (!consumed.ok) {
            throw Errors.ACCESS_CODE_INVALID();
        }
    }

    res.status(200).json({
        success: true,
        code: 'PRESCRIPTION_RETRIEVED',
        message: 'Prescription retrieved successfully',
        data: { prescription },
    });
});

// Pharmacist: change status if patient grants access
export const updatePrescriptionStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const accessCode = req.query.accessCode;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        throw Errors.INVALID_PAYLOAD();
    }

    const prescription = await prescriptionModel.getPrescriptionById(id);
    if (!prescription) {
        throw Errors.PRESCRIPTION_NOT_FOUND();
    }

    if (!prescription.patientId) {
        throw Errors.INSUFFICIENT_PERMISSIONS();
    }

    if (!prescription.pharmacist || prescription.pharmacist.userId !== req.user.id) {
        throw Errors.INSUFFICIENT_PERMISSIONS();
    }

    const consumed = await prescriptionModel.consumePatientAccessCode({
        patientId: prescription.patientId,
        code: accessCode,
        roleAllowed: 'pharmacist',
        requiredAction: 'edit',
        accessedByUserId: req.user.id,
    });

    if (!consumed.ok) {
        throw Errors.ACCESS_CODE_INVALID();
    }

    const updated = await prescriptionModel.updatePrescriptionStatus(id, status);

    res.status(200).json({
        success: true,
        code: 'PRESCRIPTION_STATUS_UPDATED',
        message: 'Prescription status updated successfully',
        data: { prescription: updated },
    });
});

// Patient: generate access code to share prescriptions (view/edit)
export const createAccessCode = asyncHandler(async (req, res) => {
    const { roleAllowed, action, expiresInMinutes } = req.body;

    if (!roleAllowed || !['doctor', 'pharmacist'].includes(roleAllowed)) {
        throw Errors.INVALID_PAYLOAD();
    }
    if (!action || !['view', 'edit'].includes(action)) {
        throw Errors.INVALID_PAYLOAD();
    }

    const result = await prescriptionModel.createPatientAccessCode({
        patientUserId: req.user.id,
        roleAllowed,
        action,
        expiresInMinutes: expiresInMinutes ?? 60,
    });

    if (!result.ok) {
        throw Errors.INVALID_PAYLOAD();
    }

    res.status(201).json({
        success: true,
        code: 'ACCESS_CODE_CREATED',
        message: 'Access code created successfully',
        data: { accessCode: result.accessCode },
    });
});
