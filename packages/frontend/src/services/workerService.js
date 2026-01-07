import api from './api';

/**
 * Worker Service
 * Handles all worker-related API calls
 */

// Get workers for a business
export const getBusinessWorkers = async (businessId, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/businesses/${businessId}/workers${params ? `?${params}` : ''}`);
  return response.data;
};

// Get worker by ID
export const getWorkerById = async (workerId) => {
  const response = await api.get(`/workers/${workerId}`);
  return response.data;
};

// Create worker
export const createWorker = async (businessId, workerData) => {
  const response = await api.post(`/businesses/${businessId}/workers`, workerData);
  return response.data;
};

// Update worker
export const updateWorker = async (businessId, workerId, workerData) => {
  const response = await api.put(`/businesses/${businessId}/workers/${workerId}`, workerData);
  return response.data;
};

// Delete worker
export const deleteWorker = async (businessId, workerId) => {
  const response = await api.delete(`/businesses/${businessId}/workers/${workerId}`);
  return response.data;
};

// Toggle worker status
export const toggleWorkerStatus = async (businessId, workerId) => {
  const response = await api.patch(`/businesses/${businessId}/workers/${workerId}/toggle`);
  return response.data;
};

// Update worker location
export const updateWorkerLocation = async (businessId, workerId, longitude, latitude) => {
  const response = await api.put(`/businesses/${businessId}/workers/${workerId}/location`, {
    longitude,
    latitude,
  });
  return response.data;
};

// Set worker online status
export const setWorkerOnlineStatus = async (businessId, workerId, isOnline) => {
  const response = await api.put(`/businesses/${businessId}/workers/${workerId}/status`, {
    isOnline,
  });
  return response.data;
};

// Get nearby online workers
export const getNearbyOnlineWorkers = async (longitude, latitude, maxDistance = 10) => {
  const params = new URLSearchParams({ longitude, latitude, maxDistance }).toString();
  const response = await api.get(`/workers/nearby?${params}`);
  return response.data;
};

// Assign services to worker
export const assignServices = async (businessId, workerId, serviceIds) => {
  const response = await api.put(`/businesses/${businessId}/workers/${workerId}/services`, {
    serviceIds,
  });
  return response.data;
};

// Add certification
export const addCertification = async (businessId, workerId, certificationData) => {
  const response = await api.post(
    `/businesses/${businessId}/workers/${workerId}/certifications`,
    certificationData
  );
  return response.data;
};

// Update availability
export const updateAvailability = async (businessId, workerId, availabilityData) => {
  const response = await api.put(
    `/businesses/${businessId}/workers/${workerId}/availability`,
    availabilityData
  );
  return response.data;
};

export default {
  getBusinessWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  toggleWorkerStatus,
  updateWorkerLocation,
  setWorkerOnlineStatus,
  getNearbyOnlineWorkers,
  assignServices,
  addCertification,
  updateAvailability,
};

