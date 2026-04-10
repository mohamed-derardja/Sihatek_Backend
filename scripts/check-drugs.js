import prisma from '../src/config/prisma.js';

const checkDrugs = async () => {
    try {
        const count = await prisma.drug.count();
        const drugs = await prisma.drug.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        });

        console.log(`Total drugs in database: ${count}`);
        console.log(`\nLast 5 inserted drugs:`);
        drugs.forEach((drug, index) => {
            console.log(`${index + 1}. ${drug.name} - Manufacturer: ${drug.manufacturer}`);
        });

        await prisma.$disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDrugs();
