const User = require('../models/user.model');
const jwtService = require('./jwt.service');
const emailService = require('./email.service');

/**
 * Register a new user
 */
const register = async userData => {
  // Check if user already exists
  const existingUser = await User.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Create new user
  const user = new User({
    email: userData.email,
    password: userData.password,
    userType: userData.userType || 'pet_owner',
    profile: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
    },
  });

  // Generate email verification token
  const verificationToken = jwtService.generateEmailVerificationToken();
  user.emailVerificationToken = jwtService.hashToken(verificationToken);
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save();

  // Send verification email
  try {
    await emailService.sendVerificationEmail(user.email, verificationToken, user.profile.firstName);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Don't fail registration if email fails
  }

  // Generate tokens
  const tokens = jwtService.generateTokens(user);

  // Save refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    tokens,
  };
};

/**
 * Login user
 */
const login = async (email, password) => {
  // Find user and include password
  const user = await User.findByEmail(email).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if account is active
  if (user.status !== 'active') {
    throw new Error('Account is suspended or deleted');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const tokens = jwtService.generateTokens(user);

  // Save refresh token and update last login
  user.refreshToken = tokens.refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: user.toPublicJSON(),
    tokens,
  };
};

/**
 * Refresh access token
 */
const refreshToken = async refreshToken => {
  // Verify refresh token
  const decoded = jwtService.verifyRefreshToken(refreshToken);

  // Find user
  const user = await User.findById(decoded.sub);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if refresh token matches
  if (user.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }

  // Generate new tokens
  const tokens = jwtService.generateTokens(user);

  // Update refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    tokens,
  };
};

/**
 * Logout user
 */
const logout = async userId => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};

/**
 * Verify email
 */
const verifyEmail = async token => {
  const hashedToken = jwtService.hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return user.toPublicJSON();
};

/**
 * Request password reset
 */
const forgotPassword = async email => {
  const user = await User.findByEmail(email);

  if (!user) {
    // Don't reveal if email exists
    return { message: 'If email exists, password reset link has been sent' };
  }

  // Generate reset token
  const resetToken = jwtService.generatePasswordResetToken();
  user.passwordResetToken = jwtService.hashToken(resetToken);
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Send password reset email
  try {
    await emailService.sendPasswordResetEmail(user.email, resetToken, user.profile.firstName);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }

  return { message: 'If email exists, password reset link has been sent' };
};

/**
 * Reset password
 */
const resetPassword = async (token, newPassword) => {
  const hashedToken = jwtService.hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Invalid or expired password reset token');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null; // Invalidate all refresh tokens
  await user.save();

  return { message: 'Password reset successful' };
};

/**
 * Change password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshToken = null; // Invalidate all refresh tokens
  await user.save();

  return { message: 'Password changed successfully' };
};

/**
 * Get current user
 */
const getCurrentUser = async userId => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.toPublicJSON();
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
};

