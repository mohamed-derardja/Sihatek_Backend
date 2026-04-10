import prisma from '../src/config/prisma.js';

const cleanupCorruptedData = async () => {
    try {
        console.log('🧹 Starting cleanup of corrupted data...\n');

        // Find drugs with quotes in key fields
        const corruptedDrugs = await prisma.drug.findMany({
            where: {
                OR: [
                    { imageUrl: { startsWith: '"' } },
                    { composition: { startsWith: '"' } },
                    { uses: { startsWith: '"' } },
                    { sideEffects: { startsWith: '"' } },
                    { manufacturer: { startsWith: '"' } },
                ],
            },
        });

        console.log(`Found ${corruptedDrugs.length} corrupted records\n`);

        // Delete all corrupted records
        if (corruptedDrugs.length > 0) {
            const deleteResult = await prisma.drug.deleteMany({
                where: {
                    OR: [
                        { imageUrl: { startsWith: '"' } },
                        { composition: { startsWith: '"' } },
                        { uses: { startsWith: '"' } },
                        { sideEffects: { startsWith: '"' } },
                        { manufacturer: { startsWith: '"' } },
                    ],
                },
            });

            console.log(`✅ Deleted ${deleteResult.count} corrupted records`);
        }

        // Get final count
        const finalCount = await prisma.drug.count();
        console.log(`\n📊 Final drug count in database: ${finalCount}`);
    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
    } finally {
        await prisma.$disconnect();
    }
};

cleanupCorruptedData();
