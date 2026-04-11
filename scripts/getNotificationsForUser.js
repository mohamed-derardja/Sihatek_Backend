import prisma from '../src/config/prisma.js';

async function getNotificationsForUser() {
  try {
    console.log('📬 Fetching notifications for user ID 1\n');
    
    // Get all notifications
    const notifications = await prisma.notification.findMany({
      where: { userId: 1 },
      orderBy: { createdAt: 'desc' },
    });
    
    console.log(`✅ Found ${notifications.length} notification(s)\n`);
    
    notifications.forEach((notif, index) => {
      console.log(`📧 Notification ${index + 1}:`);
      console.log(`   ID: ${notif.id}`);
      console.log(`   Type: ${notif.type}`);
      console.log(`   Title: ${notif.title}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Is Read: ${notif.isRead}`);
      if (notif.data) {
        console.log(`   Extra Data: ${notif.data}`);
      }
      console.log(`   Created: ${notif.createdAt}`);
      console.log('');
    });
    
    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: { userId: 1, isRead: false },
    });
    
    console.log(`📊 Statistics:`);
    console.log(`   Total notifications: ${notifications.length}`);
    console.log(`   Unread: ${unreadCount}`);
    console.log(`   Read: ${notifications.length - unreadCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getNotificationsForUser();
