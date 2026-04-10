import prisma from '../src/config/prisma.js';

const verifySample = async () => {
    try {
        const drugs = await prisma.drug.findMany({
            take: 3,
            select: {
                id: true,
                name: true,
                imageUrl: true,
                composition: true,
                uses: true,
            },
        });

        console.log('Sample records - data quality check:\n');
        drugs.forEach((drug, index) => {
            console.log(`${index + 1}. ${drug.name}`);
            console.log(`   ImageUrl: ${drug.imageUrl}`);
            console.log(`   Composition: ${drug.composition?.substring(0, 80)}...`);
            console.log(`   Uses: ${drug.uses?.substring(0, 80)}...`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
};

verifySample();
