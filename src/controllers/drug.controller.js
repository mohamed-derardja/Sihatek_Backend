import * as drugModel from '../models/Drug.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Errors } from '../errors/errors.js';

// Get all drugs with pagination
export const getAllDrugs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await drugModel.getAllDrugs(page, limit);

    res.status(200).json({
        success: true,
        code: 'DRUGS_RETRIEVED',
        message: 'Drugs retrieved successfully',
        data: result,
    });
});

// Search drugs by name, description, manufacturer, or uses
export const searchDrugs = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!query || query.trim().length < 2) {
        throw Errors.INVALID_PAYLOAD();
    }

    const result = await drugModel.searchDrugs(query.trim(), page, limit);

    res.status(200).json({
        success: true,
        code: 'DRUGS_SEARCH_SUCCESS',
        message: 'Drugs search completed',
        data: result,
    });
});

// Get drug by ID
export const getDrugById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const drug = await drugModel.getDrugById(parseInt(id));
    if (!drug) {
        throw Errors.DRUG_NOT_FOUND();
    }

    res.status(200).json({
        success: true,
        code: 'DRUG_RETRIEVED',
        message: 'Drug retrieved successfully',
        data: { drug },
    });
});

// Create new drug
export const createDrug = asyncHandler(async (req, res) => {
    const { name, description, composition, uses, sideEffects, imageUrl, manufacturer, excellentReviewPercent, averageReviewPercent, poorReviewPercent } = req.body;

    if (!name || !name.trim()) {
        throw Errors.INVALID_PAYLOAD();
    }

    // Check if drug already exists
    const existingDrug = await drugModel.findDrugByName(name.trim());
    if (existingDrug) {
        throw Errors.DRUG_ALREADY_EXISTS();
    }

    const drug = await drugModel.createDrug({
        name: name.trim(),
        description: description?.trim() || null,
        composition: composition?.trim() || null,
        uses: uses?.trim() || null,
        sideEffects: sideEffects?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        manufacturer: manufacturer?.trim() || null,
        excellentReviewPercent: excellentReviewPercent ? parseFloat(excellentReviewPercent) : null,
        averageReviewPercent: averageReviewPercent ? parseFloat(averageReviewPercent) : null,
        poorReviewPercent: poorReviewPercent ? parseFloat(poorReviewPercent) : null,
    });

    res.status(201).json({
        success: true,
        code: 'DRUG_CREATED',
        message: 'Drug created successfully',
        data: { drug },
    });
});

// Update drug
export const updateDrug = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, composition, uses, sideEffects, imageUrl, manufacturer, excellentReviewPercent, averageReviewPercent, poorReviewPercent } = req.body;

    // Check if drug exists
    const drug = await drugModel.getDrugById(parseInt(id));
    if (!drug) {
        throw Errors.DRUG_NOT_FOUND();
    }

    // If name is being updated, check for duplicates
    if (name && name.trim() !== drug.name) {
        const existingDrug = await drugModel.findDrugByName(name.trim());
        if (existingDrug) {
            throw Errors.DRUG_ALREADY_EXISTS();
        }
    }

    const updatedDrug = await drugModel.updateDrug(parseInt(id), {
        name: name?.trim() || drug.name,
        description: description !== undefined ? description?.trim() : drug.description,
        composition: composition !== undefined ? composition?.trim() : drug.composition,
        uses: uses !== undefined ? uses?.trim() : drug.uses,
        sideEffects: sideEffects !== undefined ? sideEffects?.trim() : drug.sideEffects,
        imageUrl: imageUrl !== undefined ? imageUrl?.trim() : drug.imageUrl,
        manufacturer: manufacturer !== undefined ? manufacturer?.trim() : drug.manufacturer,
        excellentReviewPercent: excellentReviewPercent !== undefined ? parseFloat(excellentReviewPercent) : drug.excellentReviewPercent,
        averageReviewPercent: averageReviewPercent !== undefined ? parseFloat(averageReviewPercent) : drug.averageReviewPercent,
        poorReviewPercent: poorReviewPercent !== undefined ? parseFloat(poorReviewPercent) : drug.poorReviewPercent,
    });

    res.status(200).json({
        success: true,
        code: 'DRUG_UPDATED',
        message: 'Drug updated successfully',
        data: { drug: updatedDrug },
    });
});

// Delete drug
export const deleteDrug = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if drug exists
    const drug = await drugModel.getDrugById(parseInt(id));
    if (!drug) {
        throw Errors.DRUG_NOT_FOUND();
    }

    await drugModel.deleteDrug(parseInt(id));

    res.status(200).json({
        success: true,
        code: 'DRUG_DELETED',
        message: 'Drug deleted successfully',
    });
});
