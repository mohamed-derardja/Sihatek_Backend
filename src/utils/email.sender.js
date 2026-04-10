import { transporter, brevoClient } from "../config/mail.js";
import { ENV } from "../config/env.js";



// Send email using Nodemailer
const SendEmailWithNodemailer = async (to, subject, textContent, htmlContent) => {
    const mailOptions = {
        from: `"Sihati" Platform <${ENV.emailUser}>`,
        to,
        subject,
        text: textContent,
        html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
};

// Send email using Brevo (Sendinblue) API
const SendEmailWithBrevo = async (to, subject, textContent, htmlContent) => {
    const sendSmtpEmail = {
        sender: { name: "Sihati Platform", email: ENV.emailUser },
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent,
    };
    await brevoClient.sendTransacEmail(sendSmtpEmail);
};


export async function sendEmail(to, subject, textContent, htmlContent) {
    if (ENV.isbybrevo) {
        await SendEmailWithBrevo(to, subject, textContent, htmlContent);
    } else {
        await SendEmailWithNodemailer(to, subject, textContent, htmlContent);
    }
}



// Send verification email to new users
export async function sendVerificationEmail(to, token) {
    const verificationLink = `${ENV.FRONTEND_URL}/verify-email?token=${token}`;
    const textContent = `Welcome to Sihati! Please verify your email by clicking the link: ${verificationLink}`;
    const VerificationEmailTemplateHTML = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width:600px; margin:auto; background:#f4f6f8; padding:20px">
        <div style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08)">
            <div style="background:#2ecc71;padding:25px;text-align:center">
                <h1 style="color:white;margin:0">Sehati</h1>
            </div>
            <div style="padding:40px">
                <h2 style="color:#333;margin-bottom:10px;text-align:center">
                    Welcome to Sehati 💚
                </h2>
                <p style="color:#666;font-size:14px;line-height:1.6;text-align:center;margin-bottom:25px">
                    Thank you for joining Sehati. Your health matters to us.
                </p>
                <div style="text-align:center;margin:35px 0">
                    <a href="${verificationLink}" target="_blank"
                    style="background:#2ecc71;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block">
                    Verify Account
                    </a>
                </div>
                <p style="color:#777;font-size:13px;text-align:center">
                    ⏳ This link expires in 24 hours.
                </p>
            </div>
            <div style="border-top:1px solid #eee;padding:20px;text-align:center;font-size:12px;color:#999">
                © ${new Date().getFullYear()} Sehati Platform. All rights reserved.
            </div>
        </div>
    </div>
`;
    const mailOptions = {
        from: `"Sihati Platform" <${ENV.emailUser}>`,
        to,
        subject: "Verify Your Email Address",
        text: textContent,
        html: VerificationEmailTemplateHTML,
    };
    await sendEmail(to, mailOptions.subject, mailOptions.text, mailOptions.html);
}

// Send password reset email
export async function sendPasswordResetEmail(to, token) {
    const resetLink = `${ENV.FRONTEND_URL}/reset-password?token=${token}`;
    const textContent = `You requested a password reset. Click the link to reset your password: ${resetLink}`;
    const PasswordResetEmailTemplateHTML = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width:600px; margin:auto; background:#f4f6f8; padding:20px">
        <div style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08)">
            <div style="background:#3498db;padding:25px;text-align:center">
                <h1 style="color:white;margin:0">Sehati</h1>
            </div>
            <div style="padding:40px">
                <h2 style="color:#333;margin-bottom:10px;text-align:center">
                    Reset Your Password 🔐
                </h2>
                <p style="color:#666;font-size:14px;line-height:1.6;text-align:center;margin-bottom:25px">
                    We received a request to reset your password. Click the button below to create a new password.
                </p>
                <div style="text-align:center;margin:35px 0">
                    <a href="${resetLink}" target="_blank"
                    style="background:#3498db;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block">
                    Reset Password
                    </a>
                </div>
                <p style="color:#777;font-size:13px;text-align:center">
                    ⏳ This link expires in 1 hour.
                </p>
                <p style="color:#999;font-size:12px;text-align:center;margin-top:20px">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
            <div style="border-top:1px solid #eee;padding:20px;text-align:center;font-size:12px;color:#999">
                © ${new Date().getFullYear()} Sehati Platform. All rights reserved.
            </div>
        </div>
    </div>
`;
    const mailOptions = {
        from: `"Sehati Platform" <${ENV.emailUser}>`,
        to,
        subject: "Reset Your Password",
        text: textContent,
        html: PasswordResetEmailTemplateHTML,
    };
    await sendEmail(to, mailOptions.subject, mailOptions.text, mailOptions.html);
}