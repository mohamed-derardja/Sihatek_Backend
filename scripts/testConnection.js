import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testing Railway database connection...\n');
    
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Connection successful!');
    console.log('⏰ Database time:', result);
    
    const drugCount = await prisma.drug.count();
    console.log(`📊 Drugs in database: ${drugCount}`);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n📋 Troubleshooting steps:');
    console.error('1. Check Railway dashboard: https://railway.app');
    console.error('2. Verify PostgreSQL service is running');
    console.error('3. Check if you have deployment credits');
    console.error('4. Verify DATABASE_URL in .env is correct');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
