import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// connect to the database to verify the connection
async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log('Connected to the database successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

connectToDatabase();

export default prisma;