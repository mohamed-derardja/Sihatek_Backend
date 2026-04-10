import prisma from '../config/prisma.js';

// Create a new user
export const createUser = async (userData) => {
    return await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            role: userData.role || 'patient',
            provider: 'local',
        },
    });
};

// Find user by email
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

// Find user by ID
export const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

// Update user
export const updateUser = async (id, updateData) => {
    return await prisma.user.update({
        where: { id },
        data: updateData,
    });
};

// Create a new token
export const createToken = async (tokenData) => {
    return await prisma.token.create({
        data: {
            token: tokenData.token,
            type: tokenData.type || 'verification',
            user_id: tokenData.userId,
            expiresAt: tokenData.expiresAt,
        },
    });
};

// Find token
export const findToken = async (token) => {
    return await prisma.token.findUnique({
        where: { token },
    });
};

// Delete token
export const deleteToken = async (id) => {
    return await prisma.token.delete({
        where: { id },
    });
};

// Delete token by user ID and type
export const deleteTokenByUserIdAndType = async (userId, type) => {
    return await prisma.token.deleteMany({
        where: { user_id: userId, type },
    });
};

// Create a session
export const createSession = async (sessionData) => {
    return await prisma.session.create({
        data: {
            user_id: sessionData.userId,
            refresh_token: sessionData.refreshToken,
            expiresAt: sessionData.expiresAt,
            userAgent: sessionData.userAgent,
            ipAddress: sessionData.ipAddress,
        },
    });
};

// Find session
export const findSession = async (id) => {
    return await prisma.session.findUnique({
        where: { id },
    });
};

// Find session by refresh token
export const findSessionByRefreshToken = async (refreshToken) => {
    return await prisma.session.findUnique({
        where: { refresh_token: refreshToken },
    });
};

// Delete session
export const deleteSession = async (id) => {
    return await prisma.session.delete({
        where: { id },
    });
};

// Find all sessions by user ID
export const findAllSessionsByUserId = async (userId) => {
    return await prisma.session.findMany({
        where: { user_id: userId },
        orderBy: { createdAt: 'desc' },
    });
};

// Delete all sessions for a user
export const deleteAllSessionsByUserId = async (userId) => {
    return await prisma.session.deleteMany({
        where: { user_id: userId },
    });
};
