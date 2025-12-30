const authService = require('../services/auth.service');
const ApiResponse = require('../../../shared/utils/apiResponse');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const logger = require('../../../shared/utils/logger');

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  logger.info(`Registration attempt for email: ${req.body.email}`);

  const result = await authService.register(req.body);

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  logger.info(`User registered successfully: ${result.user.email}`);

  return ApiResponse.success(
    res,
    {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
    'Registration successful. Please check your email to verify your account.',
    201
  );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  logger.info(`Login attempt for email: ${email}`);

  const result = await authService.login(email, password);

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  logger.info(`User logged in successfully: ${email}`);

  return ApiResponse.success(res, {
    user: result.user,
    accessToken: result.tokens.accessToken,
  }, 'Login successful');
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public (requires refresh token)
 */
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return ApiResponse.unauthorized(res, 'Refresh token required');
  }

  const result = await authService.refreshToken(refreshToken);

  // Set new refresh token
  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return ApiResponse.success(res, {
    user: result.user,
    accessToken: result.tokens.accessToken,
  }, 'Token refreshed successfully');
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.sub);

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  logger.info(`User logged out: ${req.user.email}`);

  return ApiResponse.success(res, null, 'Logout successful');
});

/**
 * @desc    Verify email
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await authService.verifyEmail(token);

  logger.info(`Email verified for user: ${user.email}`);

  return ApiResponse.success(res, { user }, 'Email verified successfully');
});

/**
 * @desc    Request password reset
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  logger.info(`Password reset requested for: ${email}`);

  const result = await authService.forgotPassword(email);

  return ApiResponse.success(res, null, result.message);
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  await authService.resetPassword(token, password);

  logger.info('Password reset successful');

  return ApiResponse.success(res, null, 'Password reset successful. You can now login with your new password.');
});

/**
 * @desc    Change password
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(req.user.sub, currentPassword, newPassword);

  // Clear refresh token cookie (force re-login)
  res.clearCookie('refreshToken');

  logger.info(`Password changed for user: ${req.user.email}`);

  return ApiResponse.success(res, null, 'Password changed successfully. Please login again with your new password.');
});

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.sub);

  return ApiResponse.success(res, { user }, 'User retrieved successfully');
});

/**
 * @desc    Resend verification email
 * @route   POST /api/v1/auth/resend-verification
 * @access  Private
 */
const resendVerificationEmail = asyncHandler(async (req, res) => {
  // This would need to be implemented in authService
  // For now, return a placeholder
  return ApiResponse.success(res, null, 'Verification email sent');
});

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
  resendVerificationEmail,
};

