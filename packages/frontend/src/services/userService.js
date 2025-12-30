import api from './api';

/**
 * User Service
 * Handles all user profile-related API calls
 */

// Get current user profile
export const getMyProfile = async () => {
  const response = await api.get('/users/me/profile');
  return response.data;
};

// Get user by ID (public profile)
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Update user profile
export const updateMyProfile = async (profileData) => {
  const response = await api.put('/users/me/profile', profileData);
  return response.data;
};

// Update avatar
export const updateAvatar = async (avatarUrl) => {
  const response = await api.put('/users/me/avatar', { avatarUrl });
  return response.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.put('/users/me/password', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

// Update phone number
export const updatePhone = async (phoneNumber) => {
  const response = await api.put('/users/me/phone', { phoneNumber });
  return response.data;
};

// Update address
export const updateAddress = async (addressData) => {
  const response = await api.put('/users/me/address', addressData);
  return response.data;
};

// Delete account
export const deleteAccount = async (password) => {
  const response = await api.delete('/users/me', {
    data: { password, confirmation: 'DELETE' },
  });
  return response.data;
};

export default {
  getMyProfile,
  getUserById,
  updateMyProfile,
  updateAvatar,
  changePassword,
  updatePhone,
  updateAddress,
  deleteAccount,
};

