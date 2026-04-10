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

        // Parse CSV properly
        return new Promise((resolve, reject) => {
            createReadStream(csvPath)
                .pipe(parse({ columns: true }))
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

                            // Create drug record
                            await prisma.drug.create({
                                data: {
                                    name,
                                    description: null,
                                    composition: medicine['Composition']?.trim() || null,
                                    uses: medicine['Uses']?.trim() || null,
                                    sideEffects: medicine['Side_effects']?.trim() || null,
                                    imageUrl: medicine['Image URL']?.trim() || null,
                                    manufacturer: medicine['Manufacturer']?.trim() || null,
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
                            console.error(`❌ Error inserting ${medicine['Medicine Name']}:`, error.message);
                        }
                    }

                    console.log(`\n✅ Seeding Complete!`);
                    console.log(`✅ Successfully inserted: ${successCount} new records`);
                    console.log(`⏭️  Skipped duplicates: ${duplicateCount} records`);
                    console.log(`❌ Failed: ${errorCount} records`);
                    console.log(`📊 Total processed: ${successCount + duplicateCount + errorCount} records`);

                    await prisma.$disconnect();
                    resolve();
                })
                .on('error', (error) => {
                    console.error('❌ CSV parsing error:', error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

seedDatabase().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
