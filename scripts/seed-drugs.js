import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../src/config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV file
const parseCSV = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines

        // Simple CSV parsing (handles basic cases)
        const values = lines[i].split(',');
        if (values.length < headers.length) continue;

        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || null;
        });
        data.push(row);
    }

    return data;
};

// Seed the database
const seedDatabase = async () => {
    try {
        console.log('📊 Starting database seeding from CSV...');

        // Read CSV file
        const csvPath = path.join(__dirname, '../Medicine_Details.csv');
        if (!fs.existsSync(csvPath)) {
            console.error('❌ CSV file not found at:', csvPath);
            process.exit(1);
        }

        const medicines = parseCSV(csvPath);
        console.log(`✅ Parsed ${medicines.length} records from CSV`);

        // Insert records
        let successCount = 0;
        let errorCount = 0;

        for (const medicine of medicines) {
            try {
                // Check if drug already exists
                const existing = await prisma.drug.findUnique({
                    where: { name: medicine['Medicine Name'] },
                });

                if (existing) {
                    console.log(`⏭️  Skipping duplicate: ${medicine['Medicine Name']}`);
                    continue;
                }

                // Parse percentage values
                const excellentReview = medicine['Excellent Review %'] ? parseFloat(medicine['Excellent Review %']) : null;
                const averageReview = medicine['Average Review %'] ? parseFloat(medicine['Average Review %']) : null;
                const poorReview = medicine['Poor Review %'] ? parseFloat(medicine['Poor Review %']) : null;

                // Create drug record
                await prisma.drug.create({
                    data: {
                        name: medicine['Medicine Name'],
                        description: null,
                        composition: medicine['Composition'] || null,
                        uses: medicine['Uses'] || null,
                        sideEffects: medicine['Side_effects'] || null,
                        imageUrl: medicine['Image URL'] || null,
                        manufacturer: medicine['Manufacturer'] || null,
                        excellentReviewPercent: excellentReview,
                        averageReviewPercent: averageReview,
                        poorReviewPercent: poorReview,
                    },
                });

                successCount++;
                console.log(`✅ Inserted: ${medicine['Medicine Name']}`);
            } catch (error) {
                errorCount++;
                console.error(`❌ Error inserting ${medicine['Medicine Name']}:`, error.message);
            }
        }

        console.log(`\n📈 Seeding Complete!`);
        console.log(`✅ Successfully inserted: ${successCount} records`);
        console.log(`❌ Failed: ${errorCount} records`);
        console.log(`📊 Total: ${successCount + errorCount} records processed`);

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

seedDatabase();
