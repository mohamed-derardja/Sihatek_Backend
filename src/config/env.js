import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailSecure: process.env.EMAIL_SECURE === 'true',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    brevoApiKey: process.env.BREVO_API_KEY,
    isbybrevo: process.env.IS_BY_BREVO === 'true',

    // JWT Configuration
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    jwtExpiresInAccess: process.env.JWT_EXPIRES_IN_ACCESS || '15m',
    jwtExpiresInRefresh: process.env.JWT_EXPIRES_IN_REFRESH || '7d',
    
    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
};
