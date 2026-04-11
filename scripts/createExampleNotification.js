import prisma from '../src/config/prisma.js';

async function createExampleNotification() {
  try {
    console.log('📬 Creating example notification for user ID 1\n');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: 1 },
    });
    
    if (!user) {
      console.log('❌ User ID 1 not found in database');
      return;
    }
    
    console.log(`✓ Found user: ${user.name} (${user.email})\n`);
    
    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: 1,
        type: 'access_approved',
        title: 'Access Request Approved',
        message: 'Dr. Ahmed has approved your medical data access request for their medical examination.',
        data: JSON.stringify({
          doctorName: 'Dr. Ahmed',
          accessType: 'prescriptions',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }),
        isRead: false,
      },
    });
    
    console.log('✅ Notification created successfully!\n');
    console.log('📋 Notification Details:');
    console.log(`   ID: ${notification.id}`);
    console.log(`   User ID: ${notification.userId}`);
    console.log(`   Type: ${notification.type}`);
    console.log(`   Title: ${notification.title}`);
    console.log(`   Message: ${notification.message}`);
    console.log(`   Data: ${notification.data}`);
    console.log(`   Is Read: ${notification.isRead}`);
    console.log(`   Created At: ${notification.createdAt}\n`);
    
    // Show more examples
    console.log('💡 Other notification types you can create:');
    const notificationTypes = [
      'access_requested',
      'access_approved',
      'access_rejected',
      'access_blocked',
      'drug_available',
      'drug_unavailable',
      'doctor_approved',
      'doctor_rejected',
      'pharmacist_approved',
      'pharmacist_rejected',
      'prescription_created',
      'prescription_filled',
    ];
    
    notificationTypes.forEach((type, i) => {
      console.log(`   ${i + 1}. ${type}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createExampleNotification();
