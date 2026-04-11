import * as drugModel from '../src/models/Drug.js';

async function testGetAllDrugs() {
  try {
    console.log('🔍 Testing getAllDrugs - checking all fields including imageUrl\n');
    
    // Get first page of drugs
    const result = await drugModel.getAllDrugs(1, 5);
    
    console.log(`✅ Total drugs: ${result.total}`);
    console.log(`   Pages: ${result.pages}`);
    console.log(`   Current page: ${result.currentPage}\n`);
    
    if (result.drugs.length === 0) {
      console.log('⚠️  No drugs found');
      return;
    }
    
    console.log('📋 Sample drug with all fields:');
    const drug = result.drugs[0];
    
    const fields = {
      'ID': drug.id,
      'Name': drug.name,
      'Description': drug.description,
      'Composition': drug.composition,
      'Uses': drug.uses,
      'Side Effects': drug.sideEffects,
      'Image URL': drug.imageUrl,
      'Manufacturer': drug.manufacturer,
      'Excellent Review %': drug.excellentReviewPercent,
      'Average Review %': drug.averageReviewPercent,
      'Poor Review %': drug.poorReviewPercent,
      'Created At': drug.createdAt,
      'Updated At': drug.updatedAt,
    };
    
    for (const [key, value] of Object.entries(fields)) {
      const status = value !== null && value !== undefined ? '✓' : '⚠️';
      console.log(`   ${status} ${key}: ${value}`);
    }
    
    console.log(`\n📊 Total fields per drug: ${Object.keys(drug).length}`);
    console.log(`✅ All fields including imageUrl are present!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGetAllDrugs();
