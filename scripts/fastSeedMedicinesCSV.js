import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import prisma from '../src/config/prisma.js';

async function fastSeedMedicinesFromCSV() {
  try {
    console.log('📋 Reading CSV with 1MG medicine images\n');
    
    const csvPath = path.join(process.cwd(), 'Medicine_Details.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    const allRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    // Use only first 100 medicines
    const records = allRecords.slice(0, 100);
    console.log(`✅ Loaded ${records.length} premium medicines\n`);
    
    // Prepare data
    const medicinesData = records.map(medicine => ({
      name: medicine['Medicine Name']?.trim() || 'Unknown',
      description: `Real medicine from 1MG: ${medicine['Medicine Name']?.trim()}`,
      composition: medicine.Composition?.trim() || null,
      uses: medicine.Uses?.trim() || null,
      sideEffects: medicine.Side_effects?.trim() || null,
      imageUrl: medicine['Image URL']?.trim() || null,
      manufacturer: medicine.Manufacturer?.trim() || null,
      excellentReviewPercent: parseInt(medicine['Excellent Review %']) || 0,
      averageReviewPercent: parseInt(medicine['Average Review %']) || 0,
      poorReviewPercent: parseInt(medicine['Poor Review %']) || 0,
    }));
    
    console.log('🔄 Batch inserting into database...\n');
    
    // Create many at once
    const result = await prisma.drug.createMany({
      data: medicinesData,
      skipDuplicates: true,
    });
    
    console.log(`✅ Import completed!\n`);
    console.log(`📊 Created: ${result.count} new medicines\n`);
    
    // Get total count
    const totalDrugs = await prisma.drug.count();
    console.log(`💊 Total medicines in database: ${totalDrugs}\n`);
    
    // Show samples with 1MG images
    const samples = await prisma.drug.findMany({
      take: 5,
      where: { imageUrl: { contains: 'onemg' } },
      select: {
        id: true,
        name: true,
        manufacturer: true,
        excellentReviewPercent: true,
        imageUrl: true,
      },
    });
    
    console.log('📋 Sample medicines with 1MG images:');
    samples.forEach((medicine, i) => {
      console.log(`\n   ${i + 1}. ${medicine.name}`);
      console.log(`      💊 Manufacturer: ${medicine.manufacturer}`);
      console.log(`      ⭐ Excellent Review: ${medicine.excellentReviewPercent}%`);
      console.log(`      🖼️ Image: ${medicine.imageUrl?.substring(0, 70)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fastSeedMedicinesFromCSV();
