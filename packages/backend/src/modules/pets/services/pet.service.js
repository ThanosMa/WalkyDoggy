const Pet = require('../models/pet.model');
const User = require('../../auth/models/user.model');

/**
 * Create a new pet
 */
const createPet = async (petData, ownerId) => {
  const pet = new Pet({
    ...petData,
    ownerId,
  });

  await pet.save();
  await pet.populate('ownerId', 'profile.firstName profile.lastName email');
  
  return pet;
};

/**
 * Get all pets for a user (owned and co-owned)
 */
const getUserPets = async (userId, includeCoOwned = true) => {
  const query = includeCoOwned
    ? { $or: [{ ownerId: userId }, { coOwners: userId }], status: { $ne: 'deceased' } }
    : { ownerId: userId, status: { $ne: 'deceased' } };

  const pets = await Pet.find(query)
    .populate('ownerId', 'profile.firstName profile.lastName email')
    .populate('coOwners', 'profile.firstName profile.lastName email')
    .sort({ createdAt: -1 });

  return pets;
};

/**
 * Get pet by ID
 */
const getPetById = async (petId, userId) => {
  console.log('📋 getPetById called with petId:', petId, 'userId:', userId);
  
  const pet = await Pet.findOne({ _id: petId })
    .populate('ownerId', 'profile.firstName profile.lastName email')
    .populate('coOwners', 'profile.firstName profile.lastName email');

  if (!pet) {
    console.log('❌ Pet not found');
    throw new Error('Pet not found');
  }

  console.log('📋 Pet found:', pet.name);
  console.log('📋 Pet ownerId:', pet.ownerId);
  console.log('📋 Pet ownerId._id:', pet.ownerId?._id);
  console.log('📋 Checking access for userId:', userId);
  
  // Check if user has access
  const hasAccess = pet.hasAccess(userId);
  console.log('📋 hasAccess result:', hasAccess);
  
  if (!hasAccess) {
    throw new Error('You do not have permission to access this pet');
  }

  return pet;
};

/**
 * Update pet
 */
const updatePet = async (petId, userId, updateData) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Only owner can update pet (not co-owners)
  if (pet.ownerId.toString() !== userId.toString()) {
    throw new Error('Only the pet owner can update pet information');
  }

  // Update fields
  Object.keys(updateData).forEach(key => {
    if (key !== 'ownerId') { // Prevent changing owner
      pet[key] = updateData[key];
    }
  });

  await pet.save();
  await pet.populate('ownerId', 'profile.firstName profile.lastName email');
  await pet.populate('coOwners', 'profile.firstName profile.lastName email');

  return pet;
};

/**
 * Delete pet (permanently removes from database)
 */
const deletePet = async (petId, userId) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Only owner can delete pet
  if (pet.ownerId.toString() !== userId.toString()) {
    throw new Error('Only the pet owner can delete the pet');
  }

  // Permanently delete from database
  await Pet.findByIdAndDelete(petId);

  return { message: 'Pet deleted successfully' };
};

/**
 * Add co-owner to pet
 */
const addCoOwner = async (petId, userId, coOwnerEmail) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Only owner can add co-owners
  if (pet.ownerId.toString() !== userId.toString()) {
    throw new Error('Only the pet owner can add co-owners');
  }

  // Find co-owner by email
  const coOwner = await User.findOne({ email: coOwnerEmail.toLowerCase() });

  if (!coOwner) {
    throw new Error('User with this email not found');
  }

  // Check if already a co-owner
  if (pet.coOwners.some(id => id.toString() === coOwner._id.toString())) {
    throw new Error('This user is already a co-owner');
  }

  // Check if trying to add the owner as co-owner
  if (coOwner._id.toString() === pet.ownerId.toString()) {
    throw new Error('The owner is already the primary owner');
  }

  // Add co-owner
  pet.coOwners.push(coOwner._id);
  await pet.save();
  await pet.populate('coOwners', 'profile.firstName profile.lastName email');

  return pet;
};

/**
 * Remove co-owner from pet
 */
const removeCoOwner = async (petId, userId, coOwnerId) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Only owner can remove co-owners
  if (pet.ownerId.toString() !== userId.toString()) {
    throw new Error('Only the pet owner can remove co-owners');
  }

  // Remove co-owner
  pet.coOwners = pet.coOwners.filter(id => id.toString() !== coOwnerId.toString());
  await pet.save();

  return pet;
};

/**
 * Upload pet photo
 */
const addPetPhoto = async (petId, userId, photoUrl) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Check if user has access
  if (!pet.hasAccess(userId)) {
    throw new Error('You do not have permission to modify this pet');
  }

  pet.photos.push(photoUrl);
  await pet.save();

  return pet;
};

/**
 * Delete pet photo
 */
const deletePetPhoto = async (petId, userId, photoUrl) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Only owner can delete photos
  if (pet.ownerId.toString() !== userId.toString()) {
    throw new Error('Only the pet owner can delete photos');
  }

  pet.photos = pet.photos.filter(url => url !== photoUrl);
  await pet.save();

  return pet;
};

/**
 * Add vaccination record
 */
const addVaccination = async (petId, userId, vaccinationData) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Check if user has access
  if (!pet.hasAccess(userId)) {
    throw new Error('You do not have permission to modify this pet');
  }

  pet.medicalInfo.vaccinations.push(vaccinationData);
  await pet.save();

  return pet;
};

/**
 * Update medical info
 */
const updateMedicalInfo = async (petId, userId, medicalData) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error('Pet not found');
  }

  // Check if user has access
  if (!pet.hasAccess(userId)) {
    throw new Error('You do not have permission to modify this pet');
  }

  pet.medicalInfo = {
    ...pet.medicalInfo,
    ...medicalData,
  };
  await pet.save();

  return pet;
};

module.exports = {
  createPet,
  getUserPets,
  getPetById,
  updatePet,
  deletePet,
  addCoOwner,
  removeCoOwner,
  addPetPhoto,
  deletePetPhoto,
  addVaccination,
  updateMedicalInfo,
};

