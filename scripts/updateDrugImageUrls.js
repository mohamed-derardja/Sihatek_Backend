import prisma from '../src/config/prisma.js';

async function updateDrugImageUrls() {
  try {
    console.log('🖼️  Updating drug imageUrls to CSV-like format\n');
    
    // Get all drugs
    const drugs = await prisma.drug.findMany({
      select: { id: true, name: true },
    });
    
    console.log(`📊 Found ${drugs.length} drugs to update\n`);
    
    // Image hosting options (like a real service)
    const imageServices = [
      'https://images.unsplash.com/photo',
      'https://cdn.pixabay.com/photo',
      'https://pexels.com/photo',
    ];
    
    // Create diverse image URLs
    const updatePromises = drugs.map((drug, index) => {
      // Create slug from drug name
      const slug = drug.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Generate multiple URLs in CSV format
      const imageUrls = [
        `https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=400&h=300&auto=format&fit=crop`,
        `https://cdn.pixabay.com/photo/2020/01/26/16/18/medicine-4794897_640.jpg`,
        `https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=400&h=300&auto=format&fit=crop`,
      ];
      
      // Select URL based on index for variety
      const selectedUrl = imageUrls[index % imageUrls.length];
      
      return prisma.drug.update({
        where: { id: drug.id },
        data: {
          imageUrl: selectedUrl,
        },
      });
    });
    
    // Run all updates
    await Promise.all(updatePromises);
    
    console.log('✅ All drug imageUrls updated successfully!\n');
    
    // Show sample
    const samples = await prisma.drug.findMany({
      take: 5,
      select: { id: true, name: true, imageUrl: true },
    });
    
    console.log('📋 Sample updated drugs:');
    samples.forEach((drug, i) => {
      console.log(`\n   ${i + 1}. ${drug.name}`);
      console.log(`      ID: ${drug.id}`);
      console.log(`      Image: ${drug.imageUrl}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateDrugImageUrls();
