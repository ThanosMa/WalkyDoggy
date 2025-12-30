const asyncHandler = require('../../../shared/utils/asyncHandler');
const apiResponse = require('../../../shared/utils/apiResponse');
const userService = require('../services/user.service');

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/users/me
 * @access  Private
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user._id);
  
  apiResponse.success(res, user, 'Profile retrieved successfully');
});

/**
 * @desc    Get user by ID (public profile)
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  apiResponse.success(res, user, 'User retrieved successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user._id, req.body);
  
  apiResponse.success(res, user, 'Profile updated successfully');
});

/**
 * @desc    Update user avatar
 * @route   PUT /api/v1/users/me/avatar
 * @access  Private
 */
const updateAvatar = asyncHandler(async (req, res) => {
  const user = await userService.updateUserAvatar(req.user._id, req.body.avatarUrl);
  
  apiResponse.success(res, user, 'Avatar updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/users/me/password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const result = await userService.changePassword(
    req.user._id,
    req.body.currentPassword,
    req.body.newPassword
  );
  
  apiResponse.success(res, result, 'Password changed successfully');
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users/me
 * @access  Private
 */
const deleteAccount = asyncHandler(async (req, res) => {
  const result = await userService.deleteUserAccount(req.user._id, req.body.password);
  
  apiResponse.success(res, result, 'Account deleted successfully');
});

/**
 * @desc    Update phone number
 * @route   PUT /api/v1/users/me/phone
 * @access  Private
 */
const updatePhone = asyncHandler(async (req, res) => {
  const user = await userService.updatePhoneNumber(req.user._id, req.body.phoneNumber);
  
  apiResponse.success(res, user, 'Phone number updated successfully');
});

/**
 * @desc    Update address
 * @route   PUT /api/v1/users/me/address
 * @access  Private
 */
const updateAddress = asyncHandler(async (req, res) => {
  const user = await userService.updateAddress(req.user._id, req.body);
  
  apiResponse.success(res, user, 'Address updated successfully');
});

module.exports = {
  getMyProfile,
  getUserById,
  updateMyProfile,
  updateAvatar,
  changePassword,
  deleteAccount,
  updatePhone,
  updateAddress,
};

