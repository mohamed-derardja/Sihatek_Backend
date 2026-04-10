import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as GuestPatientModel from '../models/GuestPatient.js';

export const listMyGuestPatients = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;

    const result = await GuestPatientModel.listGuestPatientsByCreatorUserId({
        creatorUserId: req.user.id,
        page,
        limit,
    });

    if (!result.ok) {
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(200).json({
        success: true,
        code: 'GUEST_PATIENTS_RETRIEVED',
        message: 'Guest patients retrieved successfully',
        data: result.data,
    });
});

export const getMyGuestPatientById = asyncHandler(async (req, res) => {
    const guestPatient = await GuestPatientModel.getGuestPatientById({ id: req.params.id });
    if (!guestPatient) {
        throw new AppError('Guest patient not found', 404, 'GUEST_PATIENT_NOT_FOUND');
    }

    if (req.user.role !== 'admin' && guestPatient.createdById !== req.user.id) {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    res.status(200).json({
        success: true,
        code: 'GUEST_PATIENT_RETRIEVED',
        message: 'Guest patient retrieved successfully',
        data: { guestPatient },
    });
});

export const createMyGuestPatient = asyncHandler(async (req, res) => {
    const result = await GuestPatientModel.createGuestPatient({
        creatorUserId: req.user.id,
        payload: req.body,
    });

    if (!result.ok) {
        if (result.reason === 'missing_name') {
            throw new AppError('Name is required', 400, 'INVALID_PAYLOAD');
        }
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(201).json({
        success: true,
        code: 'GUEST_PATIENT_CREATED',
        message: 'Guest patient created successfully',
        data: { guestPatient: result.guestPatient },
    });
});

export const updateMyGuestPatient = asyncHandler(async (req, res) => {
    const result = await GuestPatientModel.updateGuestPatient({
        id: req.params.id,
        creatorUserId: req.user.id,
        payload: req.body,
    });

    if (!result.ok) {
        if (result.reason === 'not_found') {
            throw new AppError('Guest patient not found', 404, 'GUEST_PATIENT_NOT_FOUND');
        }
        if (result.reason === 'forbidden') {
            throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
        }
        if (result.reason === 'missing_name') {
            throw new AppError('Name is required', 400, 'INVALID_PAYLOAD');
        }
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(200).json({
        success: true,
        code: 'GUEST_PATIENT_UPDATED',
        message: 'Guest patient updated successfully',
        data: { guestPatient: result.guestPatient },
    });
});

export const deleteMyGuestPatient = asyncHandler(async (req, res) => {
    const result = await GuestPatientModel.deleteGuestPatient({
        id: req.params.id,
        creatorUserId: req.user.id,
    });

    if (!result.ok) {
        if (result.reason === 'not_found') {
            throw new AppError('Guest patient not found', 404, 'GUEST_PATIENT_NOT_FOUND');
        }
        if (result.reason === 'forbidden') {
            throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
        }
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(200).json({
        success: true,
        code: 'GUEST_PATIENT_DELETED',
        message: 'Guest patient deleted successfully',
    });
});
