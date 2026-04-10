import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import prisma from '../src/config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seed the database with proper CSV parsing
const seedDatabase = async () => {
    try {
        console.log('📊 Starting database seeding from CSV...');

        const csvPath = path.join(__dirname, '../Medicine_Details.csv');
        if (!fs.existsSync(csvPath)) {
            console.error('❌ CSV file not found at:', csvPath);
            process.exit(1);
        }

        const medicines = [];
        let lineCount = 0;

        // Parse CSV properly with relax_quotes to handle quoted fields
        return new Promise((resolve, reject) => {
            createReadStream(csvPath)
                .pipe(parse({ columns: true, relax_quotes: true }))
                .on('data', (row) => {
                    medicines.push(row);
                })
                .on('end', async () => {
                    console.log(`✅ Parsed ${medicines.length} records from CSV`);

                    // Insert records
                    let successCount = 0;
                    let errorCount = 0;
                    let duplicateCount = 0;

                    for (const medicine of medicines) {
                        try {
                            const name = medicine['Medicine Name']?.trim();
                            if (!name) continue;

                            // Check if drug already exists
                            const existing = await prisma.drug.findUnique({
                                where: { name },
                            });

                            if (existing) {
                                duplicateCount++;
                                continue;
                            }

                            // Parse percentage values
                            const excellentReview = medicine['Excellent Review %'] ? parseFloat(medicine['Excellent Review %']) : null;
                            const averageReview = medicine['Average Review %'] ? parseFloat(medicine['Average Review %']) : null;
                            const poorReview = medicine['Poor Review %'] ? parseFloat(medicine['Poor Review %']) : null;

                            // Helper function to clean quoted strings
                            const cleanString = (str) => {
                                if (!str) return null;
                                // Remove leading/trailing quotes if present
                                return str.trim().replace(/^"+|"+$/g, '').trim() || null;
                            };

                            // Create drug record
                            await prisma.drug.create({
                                data: {
                                    name,
                                    description: null,
                                    composition: cleanString(medicine['Composition']),
                                    uses: cleanString(medicine['Uses']),
                                    sideEffects: cleanString(medicine['Side_effects']),
                                    imageUrl: cleanString(medicine['Image URL']),
                                    manufacturer: cleanString(medicine['Manufacturer']),
                                    excellentReviewPercent: excellentReview,
                                    averageReviewPercent: averageReview,
                                    poorReviewPercent: poorReview,
                                },
                            });

                            successCount++;
                            if (successCount % 50 === 0) {
                                console.log(`📈 Progress: ${successCount} records inserted...`);
                            }
                        } catch (error) {
                            errorCount++;
                            if (errorCount <= 5) {
                                console.error(`❌ Error inserting ${medicine['Medicine Name']}: ${error.message}`);
                            }
                        }
                    }

                    console.log(`
✅ Seeding completed!
📊 Statistics:
  ✅ Successfully inserted: ${successCount} new records
  ⏭️  Skipped duplicates: ${duplicateCount} records
  ❌ Failed: ${errorCount} records
`);

                    resolve();
                })
                .on('error', (error) => {
                    console.error('❌ CSV parsing error:', error.message);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

seedDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
});
