import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailSecure: process.env.EMAIL_SECURE === 'true',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    brevoApiKey: process.env.BREVOCLIENT,
};
