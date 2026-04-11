import prisma from '../config/prisma.js';

// Get all drugs with pagination
export const getAllDrugs = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [drugs, total] = await Promise.all([
        prisma.drug.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                description: true,
                composition: true,
                uses: true,
                sideEffects: true,
                imageUrl: true,
                manufacturer: true,
                excellentReviewPercent: true,
                averageReviewPercent: true,
                poorReviewPercent: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.drug.count(),
    ]);
    return { drugs, total, pages: Math.ceil(total / limit), currentPage: page };
};

// Search drugs by name only
export const searchDrugs = async (query, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [drugs, total] = await Promise.all([
        prisma.drug.findMany({
            where: {
                name: { contains: query, mode: 'insensitive' },
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                description: true,
                composition: true,
                uses: true,
                sideEffects: true,
                imageUrl: true,
                manufacturer: true,
                excellentReviewPercent: true,
                averageReviewPercent: true,
                poorReviewPercent: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { name: 'asc' },
        }),
        prisma.drug.count({
            where: {
                name: { contains: query, mode: 'insensitive' },
            },
        }),
    ]);
    return { drugs, total, pages: Math.ceil(total / limit), currentPage: page };
};

// Get drug by ID
export const getDrugById = async (id) => {
    return await prisma.drug.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            composition: true,
            uses: true,
            sideEffects: true,
            imageUrl: true,
            manufacturer: true,
            excellentReviewPercent: true,
            averageReviewPercent: true,
            poorReviewPercent: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// Create new drug
export const createDrug = async (drugData) => {
    return await prisma.drug.create({
        data: {
            name: drugData.name,
            description: drugData.description || null,
            composition: drugData.composition || null,
            uses: drugData.uses || null,
            sideEffects: drugData.sideEffects || null,
            imageUrl: drugData.imageUrl || null,
            manufacturer: drugData.manufacturer || null,
            excellentReviewPercent: drugData.excellentReviewPercent || null,
            averageReviewPercent: drugData.averageReviewPercent || null,
            poorReviewPercent: drugData.poorReviewPercent || null,
        },
    });
};

// Update drug
export const updateDrug = async (id, updateData) => {
    return await prisma.drug.update({
        where: { id },
        data: {
            name: updateData.name,
            description: updateData.description,
            composition: updateData.composition,
            uses: updateData.uses,
            sideEffects: updateData.sideEffects,
            imageUrl: updateData.imageUrl,
            manufacturer: updateData.manufacturer,
            excellentReviewPercent: updateData.excellentReviewPercent,
            averageReviewPercent: updateData.averageReviewPercent,
            poorReviewPercent: updateData.poorReviewPercent,
            updatedAt: new Date(),
        },
    });
};

// Delete drug
export const deleteDrug = async (id) => {
    return await prisma.drug.delete({
        where: { id },
    });
};

// Find drug by name
export const findDrugByName = async (name) => {
    return await prisma.drug.findUnique({
        where: { name },
    });
};

// Get drug count
export const getDrugCount = async () => {
    return await prisma.drug.count();
};
