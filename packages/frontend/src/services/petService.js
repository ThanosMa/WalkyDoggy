import api from './api';

/**
 * Pet Service
 * Handles all pet-related API calls
 */

// Get all pets for current user
export const getMyPets = async (includeCoOwned = true) => {
  const response = await api.get('/pets', {
    params: { includeCoOwned },
  });
  return response.data;
};

// Get pet by ID
export const getPetById = async (petId) => {
  const response = await api.get(`/pets/${petId}`);
  return response.data;
};

// Create new pet
export const createPet = async (petData) => {
  const response = await api.post('/pets', petData);
  return response.data;
};

// Update pet
export const updatePet = async (petId, petData) => {
  const response = await api.put(`/pets/${petId}`, petData);
  return response.data;
};

// Delete pet
export const deletePet = async (petId) => {
  const response = await api.delete(`/pets/${petId}`);
  return response.data;
};

// Add co-owner
export const addCoOwner = async (petId, email) => {
  const response = await api.post(`/pets/${petId}/co-owners`, { email });
  return response.data;
};

// Remove co-owner
export const removeCoOwner = async (petId, coOwnerId) => {
  const response = await api.delete(`/pets/${petId}/co-owners/${coOwnerId}`);
  return response.data;
};

// Add photo
export const addPetPhoto = async (petId, photoUrl) => {
  const response = await api.post(`/pets/${petId}/photos`, { photoUrl });
  return response.data;
};

// Delete photo
export const deletePetPhoto = async (petId, photoUrl) => {
  const response = await api.delete(`/pets/${petId}/photos`, { data: { photoUrl } });
  return response.data;
};

// Add vaccination
export const addVaccination = async (petId, vaccinationData) => {
  const response = await api.post(`/pets/${petId}/vaccinations`, vaccinationData);
  return response.data;
};

// Update medical info
export const updateMedicalInfo = async (petId, medicalData) => {
  const response = await api.put(`/pets/${petId}/medical`, medicalData);
  return response.data;
};

export default {
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  addCoOwner,
  removeCoOwner,
  addPetPhoto,
  deletePetPhoto,
  addVaccination,
  updateMedicalInfo,
};

