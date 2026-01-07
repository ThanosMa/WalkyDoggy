const User = require('../../auth/models/user.model');

/**
 * Get user profile by ID
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user.toPublicJSON();
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Update profile fields
  if (updateData.profile) {
    Object.keys(updateData.profile).forEach(key => {
      if (key === 'address' && updateData.profile.address) {
        // Start with existing address or empty object
        const currentAddress = user.profile.address || {};
        
        // Only update fields that are explicitly provided (not undefined)
        Object.keys(updateData.profile.address).forEach(addressKey => {
          if (updateData.profile.address[addressKey] !== undefined) {
            if (!user.profile.address) {
              user.profile.address = {};
            }
            user.profile.address[addressKey] = updateData.profile.address[addressKey];
          }
        });
      } else {
        user.profile[key] = updateData.profile[key];
      }
    });
  }

  // Update email (requires re-verification)
  if (updateData.email && updateData.email !== user.email) {
    user.email = updateData.email;
    user.isEmailVerified = false;
    // TODO: Send verification email
  }

  await user.save();
  return user.toPublicJSON();
};

/**
 * Update user avatar
 */
const updateUserAvatar = async (userId, avatarUrl) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.profile.avatar = avatarUrl;
  await user.save();

  return user.toPublicJSON();
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
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  
  if (!isPasswordCorrect) {
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

/**
 * Delete user account
 */
const deleteUserAccount = async (userId, password) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  // Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    throw new Error('Password is incorrect');
  }

  // Soft delete - set status to deleted
  user.status = 'deleted';
  await user.save();

  return { message: 'Account deleted successfully' };
};

/**
 * Get user by ID (public profile)
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.status === 'deleted') {
    throw new Error('User not found');
  }

  return user.toPublicJSON();
};

/**
 * Update phone number
 */
const updatePhoneNumber = async (userId, phoneNumber) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.profile.phoneNumber = phoneNumber;
  user.isPhoneVerified = false; // Require re-verification
  await user.save();

  return user.toPublicJSON();
};

/**
 * Update address with coordinates
 */
const updateAddress = async (userId, addressData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.profile.address = {
    ...user.profile.address,
    ...addressData,
  };

  await user.save();
  return user.toPublicJSON();
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  changePassword,
  deleteUserAccount,
  getUserById,
  updatePhoneNumber,
  updateAddress,
};

