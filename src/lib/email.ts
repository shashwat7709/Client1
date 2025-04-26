import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendBulkEmail = async ({ to, subject, html }: EmailOptions) => {
  if (Array.isArray(to)) {
    // Split into chunks of 50 to avoid email provider limits
    const chunkSize = 50;
    for (let i = 0; i < to.length; i += chunkSize) {
      const chunk = to.slice(i, i + chunkSize);
      await sendEmail({
        to: chunk,
        subject,
        html,
      });
      // Add a small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } else {
    await sendEmail({ to, subject, html });
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4A3E3E; font-family: serif;">Welcome to Our Heritage Circle</h1>
      <p>Thank you for subscribing to our newsletter. Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #4A3E3E; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Verify Email Address
      </a>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this verification, you can safely ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Heritage Circle Newsletter',
    html,
  });
}; 