import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

// Common drug data for realistic seeding
const manufacturers = [
  'Pharma Corp', 'MediGen Inc', 'HealthCare Solutions', 'BioPharm Ltd', 'GeneMed',
  'AlphaPharm', 'ChemicalWorks', 'PharmaGlobal', 'MediCare Plus', 'SuperPharma'
];

const drugCategories = [
  'Antibiotics', 'Antihistamines', 'Anti-inflammatory', 'Antacids', 'Painkillers',
  'Vitamins', 'Cold & Cough', 'Diabetes Management', 'Heart Health', 'Mental Health',
  'Digestive', 'Respiratory', 'Sleep Aid', 'Allergy Relief', 'Blood Pressure',
  'Cholesterol', 'Migraine', 'Fever Reducer', 'Muscle Relaxant', 'Antibiotic Cream'
];

const commonSideEffects = [
  'Headache, dizziness',
  'Nausea, mild upset stomach',
  'Drowsiness, fatigue',
  'Allergic reaction in sensitive individuals',
  'Generally well tolerated',
  'May cause dry mouth',
  'Possible interaction with alcohol',
  'Consult doctor if symptoms persist',
  'Rare severe side effects',
  'Minor rash possible'
];

const uses = [
  'Treatment of bacterial infections',
  'Relief from allergic reactions',
  'Reduction of inflammation',
  'Pain and fever management',
  'Vitamin supplementation',
  'Cold and flu relief',
  'Diabetes management',
  'Heart health support',
  'Sleep improvement',
  'Digestive support'
];

// Generate random drug name
function generateDrugName(index) {
  const prefixes = ['Ana', 'Para', 'Meta', 'Hydro', 'Neuro', 'Cardio', 'gastro', 'Pyro', 'Cyto', 'Thermo'];
  const suffixes = ['xil', 'zine', 'prox', 'dol', 'mycin', 'phil', 'zepam', 'flex', 'mol', 'stat'];
  const adj = ['Plus', 'Pro', 'Max', 'Fast', 'Extra', 'Super', 'Ultra'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const adj2 = Math.random() > 0.5 ? adj[Math.floor(Math.random() * adj.length)] : '';

  return `${prefix}${suffix}${adj2}-${index}`.replace(/--/g, '-');
}

// Generate composition
function generateComposition() {
  const compounds = ['Ibuprofen', 'Paracetamol', 'Aspirin', 'Amoxicillin', 'Diphenhydramine', 'Omeprazole', 'Metformin', 'Vitamin C', 'Vitamin B12', 'Calcium'];
  const doses = ['250mg', '500mg', '1000mg', '50mg', '25mg', '100mg', '200mg'];
  
  const compound = compounds[Math.floor(Math.random() * compounds.length)];
  const dose = doses[Math.floor(Math.random() * doses.length)];
  
  return `${compound} ${dose}`;
}

// Generate percentage
function generatePercentage() {
  return Math.floor(Math.random() * 100);
}

// Main seeding function
async function seedDrugs() {
  try {
    console.log('🔄 Starting drug seeding...\n');

    // Check if drugs already exist
    const existingCount = await prisma.drug.count();
    console.log(`📊 Existing drugs in database: ${existingCount}`);

    const drugs = [];
    const batchSize = 50; // Insert in batches to avoid memory issues

    // Generate 300 unique drugs
    console.log('📋 Generating 300 drug records...');
    for (let i = 1; i <= 300; i++) {
      const excellentReview = generatePercentage();
      const poorReview = generatePercentage();
      const averageReview = Math.max(0, 100 - excellentReview - poorReview);

      drugs.push({
        name: generateDrugName(i),
        description: `${drugCategories[i % drugCategories.length]} medication - High quality pharmaceutical product`,
        composition: generateComposition(),
        uses: uses[i % uses.length],
        sideEffects: commonSideEffects[i % commonSideEffects.length],
        imageUrl: `https://api.example.com/drugs/drug-${i}.jpg`,
        manufacturer: manufacturers[i % manufacturers.length],
        excellentReviewPercent: excellentReview,
        averageReviewPercent: averageReview,
        poorReviewPercent: poorReview,
      });

      if (i % 50 === 0) {
        console.log(`  ✓ Generated ${i} records...`);
      }
    }

    // Insert in batches
    console.log('\n📥 Inserting records into database...');
    let insertedCount = 0;

    for (let i = 0; i < drugs.length; i += batchSize) {
      const batch = drugs.slice(i, i + batchSize);
      
      try {
        await prisma.drug.createMany({
          data: batch,
          skipDuplicates: true,
        });
        insertedCount += batch.length;
        console.log(`  ✓ Inserted batch: ${insertedCount}/${drugs.length} records`);
      } catch (error) {
        // If batch fails, try individual inserts to skip duplicates
        console.log(`  ⚠️ Batch failed, retrying individually...`);
        for (const drug of batch) {
          try {
            await prisma.drug.create({
              data: drug,
            });
            insertedCount++;
          } catch (err) {
            if (err.code !== 'P2002') { // Skip unique constraint errors
              console.error(`  ✗ Error inserting drug ${drug.name}:`, err.message);
            }
          }
        }
      }
    }

    // Final count
    const finalCount = await prisma.drug.count();
    console.log(`\n✅ Seeding completed!`);
    console.log(`📊 Total drugs in database: ${finalCount}`);
    console.log(`➕ Added in this session: ${finalCount - existingCount}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding
seedDrugs();
