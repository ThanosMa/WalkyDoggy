const nodemailer = require('nodemailer');
const logger = require('../../../shared/utils/logger');

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'mailhog') {
    return nodemailer.createTransport({
      host: process.env.MAILHOG_HOST || 'localhost',
      port: process.env.MAILHOG_PORT || 1025,
      ignoreTLS: true,
    });
  }

  if (process.env.EMAIL_SERVICE === 'sendgrid') {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // Default to MailHog for development
  return nodemailer.createTransporter({
    host: 'localhost',
    port: 1025,
    ignoreTLS: true,
  });
};

const transporter = createTransporter();

/**
 * Send email verification email
 */
const sendVerificationEmail = async (email, token, firstName) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `${process.env.FROM_NAME || 'WalkyDoggy'} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email - WalkyDoggy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to WalkyDoggy! 🐾</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for registering with WalkyDoggy. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #6b7280; word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with WalkyDoggy, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          © ${new Date().getFullYear()} WalkyDoggy. All rights reserved.
        </p>
      </div>
    `,
    text: `
      Welcome to WalkyDoggy!
      
      Hi ${firstName},
      
      Thank you for registering. Please verify your email by visiting:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, please ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
    
    if (process.env.EMAIL_SERVICE === 'mailhog') {
      logger.info(`📧 View email at http://localhost:8025`);
    }
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, token, firstName) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `${process.env.FROM_NAME || 'WalkyDoggy'} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Reset Your Password - WalkyDoggy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Password Reset Request 🔐</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #6b7280; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p><strong>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</strong></p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          © ${new Date().getFullYear()} WalkyDoggy. All rights reserved.
        </p>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hi ${firstName},
      
      We received a request to reset your password. Visit this link to create a new password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
    
    if (process.env.EMAIL_SERVICE === 'mailhog') {
      logger.info(`📧 View email at http://localhost:8025`);
    }
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    throw error;
  }
};

/**
 * Send welcome email (after email verification)
 */
const sendWelcomeEmail = async (email, firstName, userType) => {
  const dashboardUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`;

  const mailOptions = {
    from: `${process.env.FROM_NAME || 'WalkyDoggy'} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to WalkyDoggy! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to WalkyDoggy! 🐾</h2>
        <p>Hi ${firstName},</p>
        <p>Your email has been verified successfully! We're excited to have you join our community.</p>
        ${
          userType === 'pet_owner'
            ? `
          <p>As a pet owner, you can now:</p>
          <ul>
            <li>Add your pets to your profile</li>
            <li>Search for pet care services near you</li>
            <li>Book services with trusted pet care professionals</li>
            <li>Leave reviews and ratings</li>
          </ul>
        `
            : `
          <p>As a pet care professional, you can now:</p>
          <ul>
            <li>Set up your business profile</li>
            <li>List your services</li>
            <li>Manage bookings</li>
            <li>Build your reputation with reviews</li>
          </ul>
        `
        }
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          © ${new Date().getFullYear()} WalkyDoggy. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}`);
    
    if (process.env.EMAIL_SERVICE === 'mailhog') {
      logger.info(`📧 View email at http://localhost:8025`);
    }
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    // Don't throw - this is not critical
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};

