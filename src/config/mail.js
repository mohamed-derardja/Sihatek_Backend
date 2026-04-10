import nodemailer from 'nodemailer';
import SibApiV3Sdk from '@sendinblue/client';
import { ENV } from './env.js';


// Configure Nodemailer transporter
export const transporter = nodemailer.createTransport({
    host: ENV.emailHost,
    port: ENV.emailPort,
    secure: ENV.emailSecure,
    family: 4, // Use IPv4
    auth: {
        user: ENV.emailUser,
        pass: ENV.emailPass,
    },
});

// Configure Brevo client
const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, ENV.brevoApiKey);

export const brevoClient = client;