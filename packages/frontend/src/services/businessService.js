import api from './api';

/**
 * Business Service
 * Handles all business-related API calls
 */

// Search businesses
export const searchBusinesses = async (params) => {
  const response = await api.get('/businesses/search', { params });
  return response.data;
};

// Get nearby businesses
export const getNearbyBusinesses = async (latitude, longitude, radius = 50) => {
  const response = await api.get('/businesses/nearby', {
    params: { latitude, longitude, radius },
  });
  return response.data;
};

// Get featured businesses
export const getFeaturedBusinesses = async (limit = 10) => {
  const response = await api.get('/businesses/featured', {
    params: { limit },
  });
  return response.data;
};

// Get business by ID
export const getBusinessById = async (businessId) => {
  const response = await api.get(`/businesses/${businessId}`);
  return response.data;
};

// Get my business
export const getMyBusiness = async () => {
  const response = await api.get('/businesses/my/profile');
  return response.data;
};

// Create business
export const createBusiness = async (businessData) => {
  const response = await api.post('/businesses', businessData);
  return response.data;
};

// Update business
export const updateBusiness = async (businessId, businessData) => {
  const response = await api.put(`/businesses/${businessId}`, businessData);
  return response.data;
};

// Delete business
export const deleteBusiness = async (businessId) => {
  const response = await api.delete(`/businesses/${businessId}`);
  return response.data;
};

// Add certification
export const addCertification = async (businessId, certificationData) => {
  const response = await api.post(`/businesses/${businessId}/certifications`, certificationData);
  return response.data;
};

// Update operating hours
export const updateOperatingHours = async (businessId, operatingHours) => {
  const response = await api.put(`/businesses/${businessId}/operating-hours`, operatingHours);
  return response.data;
};

// Update Stripe account
export const updateStripeAccount = async (businessId, stripeAccountId, status) => {
  const response = await api.put(`/businesses/${businessId}/stripe`, {
    stripeAccountId,
    status,
  });
  return response.data;
};

export default {
  searchBusinesses,
  getNearbyBusinesses,
  getFeaturedBusinesses,
  getBusinessById,
  getMyBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  addCertification,
  updateOperatingHours,
  updateStripeAccount,
};

