import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import prisma from '../src/config/prisma.js';

async function seedTopMedicinesFromCSV() {
  try {
    console.log('📋 Reading CSV file with real medicine data\n');
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'Medicine_Details.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const allRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    // Import only top medicines (first 200) for performance
    const BATCH_SIZE = 200;
    const records = allRecords.slice(0, BATCH_SIZE);
    
    console.log(`✅ Loaded ${records.length} top medicines from CSV (total available: ${allRecords.length})\n`);
    console.log('🔄 Processing and inserting into database...\n');
    
    let successCount = 0;
    let updateCount = 0;
    let errorCount = 0;
    
    // Process in smaller batches
    const miniBatchSize = 50;
    for (let batchStart = 0; batchStart < records.length; batchStart += miniBatchSize) {
      const batchEnd = Math.min(batchStart + miniBatchSize, records.length);
      const batch = records.slice(batchStart, batchEnd);
      
      for (const medicine of batch) {
        try {
          const medicineName = medicine['Medicine Name']?.trim();
          if (!medicineName) continue;
          
          // Try to update first
          const updated = await prisma.drug.updateMany({
            where: { name: medicineName },
            data: {
              composition: medicine.Composition?.trim() || null,
              uses: medicine.Uses?.trim() || null,
              sideEffects: medicine.Side_effects?.trim() || null,
              imageUrl: medicine['Image URL']?.trim() || null,
              manufacturer: medicine.Manufacturer?.trim() || null,
              excellentReviewPercent: getReviewPercentage(medicine['Excellent Review %']),
              averageReviewPercent: getReviewPercentage(medicine['Average Review %']),
              poorReviewPercent: getReviewPercentage(medicine['Poor Review %']),
            },
          });
          
          if (updated.count > 0) {
            updateCount++;
          } else {
            // Create new if not found
            await prisma.drug.create({
              data: {
                name: medicineName,
                description: `Medicine from PharmEasy/1MG: ${medicineName}`,
                composition: medicine.Composition?.trim() || null,
                uses: medicine.Uses?.trim() || null,
                sideEffects: medicine.Side_effects?.trim() || null,
                imageUrl: medicine['Image URL']?.trim() || null,
                manufacturer: medicine.Manufacturer?.trim() || null,
                excellentReviewPercent: getReviewPercentage(medicine['Excellent Review %']),
                averageReviewPercent: getReviewPercentage(medicine['Average Review %']),
                poorReviewPercent: getReviewPercentage(medicine['Poor Review %']),
              },
            });
            successCount++;
          }
        } catch (error) {
          if (error.code !== 'P2002') { // Skip unique constraint errors
            console.error(`   ✗ Error: ${medicine['Medicine Name']?.substring(0, 30)}`);
            errorCount++;
          }
        }
      }
      
      console.log(`   ✓ Processed ${batchEnd}/${records.length} medicines...`);
    }
    
    console.log('\n✅ CSV import completed!\n');
    console.log('📊 Summary:');
    console.log(`   Created: ${successCount} new medicines`);
    console.log(`   Updated: ${updateCount} existing medicines`);
    console.log(`   Errors: ${errorCount} failed`);
    console.log(`   Total processed: ${successCount + updateCount}\n`);
    
    // Get total count
    const totalDrugs = await prisma.drug.count();
    console.log(`💊 Total medicines in database: ${totalDrugs}\n`);
    
    // Show samples
    const samples = await prisma.drug.findMany({
      take: 5,
      where: { imageUrl: { contains: 'onemg' } },
      select: {
        id: true,
        name: true,
        manufacturer: true,
        imageUrl: true,
        excellentReviewPercent: true,
      },
    });
    
    if (samples.length > 0) {
      console.log('📋 Sample real medicines with 1MG images:');
      samples.forEach((medicine, i) => {
        console.log(`\n   ${i + 1}. ${medicine.name}`);
        console.log(`      Manufacturer: ${medicine.manufacturer}`);
        console.log(`      Review: ⭐ ${medicine.excellentReviewPercent}%`);
        console.log(`      Image: ${medicine.imageUrl?.substring(0, 80)}...`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during import:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

function getReviewPercentage(value) {
  const num = parseInt(value);
  return isNaN(num) ? 0 : num;
}

seedTopMedicinesFromCSV();
