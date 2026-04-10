import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as PatientAccess from '../models/PatientAccess.js';
import { createNotification } from './notification.controller.js';

export const createAccessRequest = asyncHandler(async (req, res) => {
    if (req.user.role !== 'doctor') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const { patientId, patientUserId, scopes, message, durationDays } = req.body || {};

    const result = await PatientAccess.createOrUpdateAccessRequest({
        doctorUserId: req.user.id,
        patientId,
        patientUserId,
        scopes,
        message,
        durationDays,
    });

    if (!result.ok) {
        if (result.reason === 'invalid_scopes') {
            throw new AppError('Invalid scopes', 400, 'INVALID_SCOPES');
        }
        if (result.reason === 'patient_not_found') {
            throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
        }
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(201).json({
        success: true,
        code: 'ACCESS_REQUEST_CREATED',
        message: 'Access request created successfully',
        data: { request: result.request },
    });
});

export const listMySentRequests = asyncHandler(async (req, res) => {
    if (req.user.role !== 'doctor') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;

    const result = await PatientAccess.listRequestsSentByDoctorUserId({
        doctorUserId: req.user.id,
        page,
        limit,
    });

    if (!result.ok) {
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(200).json({
        success: true,
        code: 'ACCESS_REQUESTS_SENT_RETRIEVED',
        message: 'Sent access requests retrieved successfully',
        data: result.data,
    });
});

export const listMyReceivedRequests = asyncHandler(async (req, res) => {
    if (req.user.role !== 'patient') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;

    const result = await PatientAccess.listRequestsReceivedByPatientUserId({
        patientUserId: req.user.id,
        page,
        limit,
    });

    if (!result.ok) {
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(200).json({
        success: true,
        code: 'ACCESS_REQUESTS_RECEIVED_RETRIEVED',
        message: 'Received access requests retrieved successfully',
        data: result.data,
    });
});

export const respondToRequest = asyncHandler(async (req, res) => {
    if (req.user.role !== 'patient') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const { status, durationDays } = req.body || {};

    const result = await PatientAccess.respondToRequestAsPatient({
        patientUserId: req.user.id,
        requestId: req.params.id,
        status,
        durationDays,
    });

    if (!result.ok) {
        if (result.reason === 'not_found') {
            throw new AppError('Access request not found', 404, 'ACCESS_REQUEST_NOT_FOUND');
        }
        if (result.reason === 'forbidden') {
            throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
        }
        if (result.reason === 'invalid_status') {
            throw new AppError('Invalid status', 400, 'INVALID_STATUS');
        }
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    // Send notification to doctor about patient's response
    try {
        const notificationType = status === 'approved' ? 'access_approved' : 'access_rejected';
        const notificationMessage = status === 'approved' 
            ? 'Your access request has been approved' 
            : 'Your access request has been rejected';
        
        await createNotification({
            userId: result.request.doctorUserId,
            type: notificationType,
            title: 'Access Request ' + (status === 'approved' ? 'Approved' : 'Rejected'),
            message: notificationMessage,
            data: { requestId: result.request.id, patientUserId: result.request.patientUserId }
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
        // Don't fail the main operation if notification fails
    }

    res.status(200).json({
        success: true,
        code: 'ACCESS_REQUEST_UPDATED',
        message: 'Access request updated successfully',
        data: { request: result.request },
    });
});

export const listMyGrants = asyncHandler(async (req, res) => {
    if (req.user.role !== 'patient') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const result = await PatientAccess.listGrantsForPatientUserId({ patientUserId: req.user.id });
    if (!result.ok) {
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    res.status(200).json({
        success: true,
        code: 'ACCESS_GRANTS_RETRIEVED',
        message: 'Access grants retrieved successfully',
        data: { grants: result.grants },
    });
});

export const revokeGrant = asyncHandler(async (req, res) => {
    if (req.user.role !== 'patient') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const result = await PatientAccess.revokeGrantAsPatient({
        patientUserId: req.user.id,
        doctorId: req.params.doctorId,
    });

    if (!result.ok) {
        if (result.reason === 'not_found') {
            throw new AppError('Access grant not found', 404, 'ACCESS_GRANT_NOT_FOUND');
        }
        throw new AppError('Invalid request', 400, 'INVALID_PAYLOAD');
    }

    // Send notification to doctor about access revocation
    try {
        await createNotification({
            userId: result.grant.doctorId,
            type: 'access_blocked',
            title: 'Access Revoked',
            message: 'Patient has revoked your access to their medical data',
            data: { grantId: result.grant.id, patientId: result.grant.patientId }
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
        // Don't fail the main operation if notification fails
    }

    res.status(200).json({
        success: true,
        code: 'ACCESS_GRANT_REVOKED',
        message: 'Access grant revoked successfully',
        data: { grant: result.grant },
    });
});
