import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function verifySeeding() {
  try {
    console.log('📊 Verifying drug records...\n');
    
    // Total count
    const total = await prisma.drug.count();
    console.log(`✅ Total drugs: ${total}\n`);
    
    // Sample records
    console.log('📋 Sample records:\n');
    const samples = await prisma.drug.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        manufacturer: true,
        composition: true,
        uses: true,
      }
    });
    
    samples.forEach((drug, i) => {
      console.log(`${i + 1}. ${drug.name}`);
      console.log(`   Manufacturer: ${drug.manufacturer}`);
      console.log(`   Composition: ${drug.composition}`);
      console.log(`   Uses: ${drug.uses}\n`);
    });
    
    // Statistics
    const manufacturers = await prisma.drug.findMany({
      select: { manufacturer: true },
      distinct: ['manufacturer']
    });
    
    console.log(`\n📈 Statistics:`);
    console.log(`   Unique manufacturers: ${manufacturers.length}`);
    console.log(`   Average drug entries: ${Math.round(total / manufacturers.length)} per manufacturer`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySeeding();
