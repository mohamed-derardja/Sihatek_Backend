import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import prisma from '../src/config/prisma.js';

async function seedDrugsFromCSV() {
  try {
    console.log('📋 Reading CSV file with real medicine data\n');
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'Medicine_Details.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    console.log(`✅ Loaded ${records.length} medicines from CSV\n`);
    console.log('🔄 Processing and inserting into database...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // Process each medicine
    for (let i = 0; i < records.length; i++) {
      const medicine = records[i];
      
      try {
        // Check if medicine already exists
        const existing = await prisma.drug.findUnique({
          where: { name: medicine['Medicine Name'].trim() },
        });
        
        if (existing) {
          // Update existing
          await prisma.drug.update({
            where: { name: medicine['Medicine Name'].trim() },
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
          skipCount++;
        } else {
          // Create new
          await prisma.drug.create({
            data: {
              name: medicine['Medicine Name'].trim(),
              description: `Real medicine: ${medicine['Medicine Name'].trim()}`,
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
        
        if ((i + 1) % 10 === 0) {
          console.log(`   ✓ Processed ${i + 1}/${records.length} medicines...`);
        }
      } catch (error) {
        console.error(`   ✗ Error processing ${medicine['Medicine Name']}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n✅ CSV import completed!\n');
    console.log('📊 Summary:');
    console.log(`   Created: ${successCount} new medicines`);
    console.log(`   Updated: ${skipCount} existing medicines`);
    console.log(`   Errors: ${errorCount} failed`);
    console.log(`   Total: ${successCount + skipCount} medicines in database\n`);
    
    // Show samples
    const samples = await prisma.drug.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        manufacturer: true,
        imageUrl: true,
        excellentReviewPercent: true,
      },
    });
    
    console.log('📋 Sample medicines:');
    samples.forEach((medicine, i) => {
      console.log(`\n   ${i + 1}. ${medicine.name}`);
      console.log(`      Manufacturer: ${medicine.manufacturer}`);
      console.log(`      Review: ⭐ ${medicine.excellentReviewPercent}%`);
      console.log(`      Image: ${medicine.imageUrl}`);
    });
    
  } catch (error) {
    console.error('❌ Error during import:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

function getReviewPercentage(value) {
  const num = parseInt(value);
  return isNaN(num) ? null : num;
}

seedDrugsFromCSV();
