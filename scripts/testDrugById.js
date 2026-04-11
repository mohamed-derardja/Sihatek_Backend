import prisma from '../src/config/prisma.js';

async function testGetDrugById() {
  try {
    console.log('🔍 Testing getDrugById...\n');
    
    // Get first drug from database
    const drug = await prisma.drug.findFirst();
    
    if (!drug) {
      console.log('❌ No drugs found in database');
      return;
    }
    
    console.log(`✅ Found drug by ID: ${drug.id}`);
    console.log(`   Name: ${drug.name}`);
    console.log(`   Manufacturer: ${drug.manufacturer}`);
    console.log(`   Composition: ${drug.composition}`);
    console.log(`   Uses: ${drug.uses}\n`);
    
    // Test with a few IDs
    const testIds = [1, 2, 3];
    console.log('📋 Testing multiple IDs:');
    
    for (const id of testIds) {
      const result = await prisma.drug.findUnique({
        where: { id }
      });
      
      if (result) {
        console.log(`   ✓ ID ${id}: ${result.name}`);
      } else {
        console.log(`   ✗ ID ${id}: Not found`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testGetDrugById();
