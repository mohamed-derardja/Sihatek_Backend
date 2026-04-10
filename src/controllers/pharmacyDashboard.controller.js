import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { createNotification } from './notification.controller.js';

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
};

// Calculate distance between two coordinates (in km) using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const getNearbyPharmaciesWithDrug = asyncHandler(async (req, res) => {
    const { latitude, longitude, radius = 10, drugName } = req.query;

    if (!latitude || !longitude) {
        throw new AppError('Latitude and longitude are required', 400, 'INVALID_PAYLOAD');
    }

    const lat = Number.parseFloat(latitude);
    const lon = Number.parseFloat(longitude);
    const rad = Number.parseFloat(radius);

    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(rad) || rad <= 0) {
        throw new AppError('Invalid coordinates or radius', 400, 'INVALID_PAYLOAD');
    }

    // Get all pharmacies with active users
    const pharmacies = await prisma.pharmacist.findMany({
        where: {
            user: { status: 'active' },
            latitude: { not: null },
            longitude: { not: null },
        },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
        },
    });

    // Filter by distance
    const nearbyPharmacies = pharmacies
        .map((pharmacy) => ({
            ...pharmacy,
            distance: calculateDistance(lat, lon, pharmacy.latitude, pharmacy.longitude),
        }))
        .filter((pharmacy) => pharmacy.distance <= rad)
        .sort((a, b) => a.distance - b.distance);

    // If drugName provided, check if pharmacies have it (in future could add inventory model)
    const result = nearbyPharmacies.map((pharmacy) => ({
        id: pharmacy.id,
        userId: pharmacy.userId,
        pharmacyName: pharmacy.pharmacyName,
        licenseNumber: pharmacy.licenseNumber,
        location: pharmacy.location,
        city: pharmacy.city,
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
        distance: parseFloat(pharmacy.distance.toFixed(2)),
        user: pharmacy.user,
    }));

    res.status(200).json({
        success: true,
        code: 'NEARBY_PHARMACIES_RETRIEVED',
        message: `Found ${result.length} pharmacies within ${rad}km`,
        data: { pharmacies: result },
    });
});

export const getPharmacistDashboard = asyncHandler(async (req, res) => {
    if (req.user.role !== 'pharmacist') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Get pharmacist profile
    const pharmacist = await prisma.pharmacist.findUnique({
        where: { userId: req.user.id },
        select: { id: true },
    });

    if (!pharmacist) {
        throw new AppError('Pharmacist profile not found', 404, 'PHARMACIST_NOT_FOUND');
    }

    // Get pending drug requests (requests without responses from this pharmacist)
    const drugRequests = await prisma.drugRequest.findMany({
        where: {
            status: 'open',
        },
        include: {
            patient: { include: { user: true } },
            drug: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    // Add pharmacist's response status if exists
    const requestsWithResponses = await Promise.all(
        drugRequests.map(async (request) => {
            const response = await prisma.pharmacyResponse.findFirst({
                where: {
                    drugRequestId: request.id,
                    pharmacistId: pharmacist.id,
                },
                select: { id: true, responseText: true, createdAt: true },
            });

            return {
                ...request,
                myResponse: response || null,
                hasResponded: !!response,
            };
        })
    );

    // Get response statistics
    const stats = {
        totalDrugRequests: drugRequests.length,
        respondedCount: requestsWithResponses.filter((r) => r.hasResponded).length,
        pendingCount: requestsWithResponses.filter((r) => !r.hasResponded).length,
    };

    res.status(200).json({
        success: true,
        code: 'PHARMACIST_DASHBOARD_RETRIEVED',
        message: 'Pharmacist dashboard retrieved successfully',
        data: {
            stats,
            drugRequests: requestsWithResponses,
        },
    });
});

export const respondToDrugRequest = asyncHandler(async (req, res) => {
    if (req.user.role !== 'pharmacist') {
        throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const drugRequestId = parseId(req.params.id);
    if (!drugRequestId) throw new AppError('Invalid request id', 400, 'INVALID_PAYLOAD');

    const { available, responseText } = req.body || {};

    if (available === undefined || available === null) {
        throw new AppError('available status is required', 400, 'INVALID_PAYLOAD');
    }

    // Get pharmacist profile
    const pharmacist = await prisma.pharmacist.findUnique({
        where: { userId: req.user.id },
        select: { id: true },
    });

    if (!pharmacist) {
        throw new AppError('Pharmacist profile not found', 404, 'PHARMACIST_NOT_FOUND');
    }

    // Get drug request
    const drugRequest = await prisma.drugRequest.findUnique({
        where: { id: drugRequestId },
        include: { drug: true, patient: true },
    });

    if (!drugRequest) {
        throw new AppError('Drug request not found', 404, 'DRUG_REQUEST_NOT_FOUND');
    }

    // Check if already responded
    const existingResponse = await prisma.pharmacyResponse.findFirst({
        where: {
            drugRequestId,
            pharmacistId: pharmacist.id,
        },
    });

    const isAvailable = Boolean(available);
    const responseMessage = String(
        responseText
            ? responseText.trim()
            : `Drug ${isAvailable ? 'is available' : 'is not available'} at ${drugRequest.patient?.name || 'pharmacy'}`
    );

    let response;
    if (existingResponse) {
        // Update existing response
        response = await prisma.pharmacyResponse.update({
            where: { id: existingResponse.id },
            data: {
                responseText: responseMessage,
                available: isAvailable,
            },
        });
    } else {
        // Create new response
        response = await prisma.pharmacyResponse.create({
            data: {
                drugRequestId,
                pharmacistId: pharmacist.id,
                responseText: responseMessage,
                available: isAvailable,
            },
        });
    }

    // Send notification to patient about drug availability
    try {
        const notificationType = isAvailable ? 'drug_available' : 'drug_unavailable';
        const notificationMessage = isAvailable 
            ? `${drugRequest.drug.name} is available at a nearby pharmacy`
            : `${drugRequest.drug.name} is not available at this pharmacy`;
        
        await createNotification({
            userId: drugRequest.patient.userId,
            type: notificationType,
            title: isAvailable ? 'Drug Available' : 'Drug Not Available',
            message: notificationMessage,
            data: { drugRequestId, responseId: response.id, drugId: drugRequest.drugId }
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
        // Don't fail the main operation if notification fails
    }

    res.status(201).json({
        success: true,
        code: 'DRUG_REQUEST_RESPONSE_CREATED',
        message: `Drug request marked as ${isAvailable ? 'available' : 'unavailable'} successfully`,
        data: {
            response: {
                ...response,
                drug: drugRequest.drug,
            },
        },
    });
});

export const getPharmacyResponses = asyncHandler(async (req, res) => {
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
    const availableOnly = req.query.available === 'true';
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const whereCondition = {
        drugRequest: { patientId },
    };

    if (availableOnly) {
        whereCondition.available = true;
    }

    const [responses, total] = await Promise.all([
        prisma.pharmacyResponse.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            skip,
            take: safeLimit,
            include: {
                drugRequest: { include: { drug: true } },
                pharmacist: { include: { user: true } },
            },
        }),
        prisma.pharmacyResponse.count({
            where: whereCondition,
        }),
    ]);

    const stats = await prisma.pharmacyResponse.groupBy({
        by: ['available'],
        where: { drugRequest: { patientId } },
        _count: true,
    });

    res.status(200).json({
        success: true,
        code: 'PHARMACY_RESPONSES_RETRIEVED',
        message: 'Pharmacy responses retrieved successfully',
        data: {
            responses,
            statistics: {
                total: stats.reduce((sum, s) => sum + s._count, 0),
                available: stats.find((s) => s.available === true)?._count || 0,
                unavailable: stats.find((s) => s.available === false)?._count || 0,
            },
            pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) },
        },
    });
});
