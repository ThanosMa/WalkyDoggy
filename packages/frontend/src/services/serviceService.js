import api from './api';

/**
 * Service Service
 * Handles all service-related API calls
 */

// Get services for a business
export const getBusinessServices = async (businessId, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/businesses/${businessId}/services${params ? `?${params}` : ''}`);
  return response.data;
};

// Get service by ID
export const getServiceById = async (serviceId) => {
  const response = await api.get(`/services/${serviceId}`);
  return response.data;
};

// Create service
export const createService = async (businessId, serviceData) => {
  const response = await api.post(`/businesses/${businessId}/services`, serviceData);
  return response.data;
};

// Update service
export const updateService = async (businessId, serviceId, serviceData) => {
  const response = await api.put(`/businesses/${businessId}/services/${serviceId}`, serviceData);
  return response.data;
};

// Delete service
export const deleteService = async (businessId, serviceId) => {
  const response = await api.delete(`/businesses/${businessId}/services/${serviceId}`);
  return response.data;
};

// Toggle service status
export const toggleServiceStatus = async (businessId, serviceId) => {
  const response = await api.patch(`/businesses/${businessId}/services/${serviceId}/toggle`);
  return response.data;
};

// Search services
export const searchServices = async (query, filters = {}) => {
  const params = new URLSearchParams({ q: query, ...filters }).toString();
  const response = await api.get(`/services/search?${params}`);
  return response.data;
};

// Get services by category
export const getServicesByCategory = async (category) => {
  const response = await api.get(`/services/category/${category}`);
  return response.data;
};

export default {
  getBusinessServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  searchServices,
  getServicesByCategory,
};

