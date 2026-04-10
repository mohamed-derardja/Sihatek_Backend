import prisma from '../src/config/prisma.js';

const checkImageUrl = async () => {
    try {
        const drugs = await prisma.drug.findMany({
            where: {
                imageUrl: {
                    startsWith: '"',
                },
            },
            select: {
                id: true,
                name: true,
                imageUrl: true,
            },
            take: 5,
        });

        console.log('Drugs with quotes in imageUrl:');
        drugs.forEach((drug) => {
            console.log(`ID: ${drug.id}`);
            console.log(`Name: ${drug.name}`);
            console.log(`ImageUrl: ${drug.imageUrl}`);
            console.log(`ImageUrl bytes: ${Buffer.from(drug.imageUrl).toString('hex')}`);
            console.log('---');
        });

        console.log(`\nTotal drugs with leading quote: ${await prisma.drug.count({ where: { imageUrl: { startsWith: '"' } } })}`);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
};

checkImageUrl();
