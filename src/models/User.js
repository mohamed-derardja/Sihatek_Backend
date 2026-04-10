import prisma from '../config/prisma.js';

// Get all users with pagination
export const getAllUsers = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                imageUrl: true,
                theme: true,
                lang: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
    ]);
    return { users, total, pages: Math.ceil(total / limit), currentPage: page };
};

// Get user by ID
export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            imageUrl: true,
            theme: true,
            lang: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// Get user by email
export const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            imageUrl: true,
            theme: true,
            lang: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// Update user by ID
export const updateUser = async (id, updateData) => {
    return await prisma.user.update({
        where: { id },
        data: {
            ...(updateData.name && { name: updateData.name }),
            ...(updateData.phone && { phone: updateData.phone }),
            ...(updateData.imageUrl && { imageUrl: updateData.imageUrl }),
            ...(updateData.theme && { theme: updateData.theme }),
            ...(updateData.lang && { lang: updateData.lang }),
            updatedAt: new Date(),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            imageUrl: true,
            theme: true,
            lang: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// Update user role (admin only)
export const updateUserRole = async (id, role) => {
    return await prisma.user.update({
        where: { id },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });
};

// Update user status (admin only)
export const updateUserStatus = async (id, status) => {
    return await prisma.user.update({
        where: { id },
        data: { status },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            updatedAt: true,
        },
    });
};

// Delete user by ID
export const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id },
        select: {
            id: true,
            email: true,
        },
    });
};

// Search users by name or email
export const searchUsers = async (query, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                imageUrl: true,
                createdAt: true,
            },
            orderBy: { name: 'asc' },
        }),
        prisma.user.count({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
        }),
    ]);
    return { users, total, pages: Math.ceil(total / limit), currentPage: page };
};

// Get users by role
export const getUsersByRole = async (role, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: { role },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                imageUrl: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where: { role } }),
    ]);
    return { users, total, pages: Math.ceil(total / limit), currentPage: page };
};

// Get user count by role
export const getUserCountByRole = async () => {
    const counts = await prisma.user.groupBy({
        by: ['role'],
        _count: true,
    });
    return counts.map(item => ({
        role: item.role,
        count: item._count,
    }));
};
