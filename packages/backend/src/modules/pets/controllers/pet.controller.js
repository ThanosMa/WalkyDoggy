const asyncHandler = require('../../../shared/utils/asyncHandler');
const apiResponse = require('../../../shared/utils/apiResponse');
const petService = require('../services/pet.service');

/**
 * @desc    Create new pet
 * @route   POST /api/v1/pets
 * @access  Private
 */
const createPet = asyncHandler(async (req, res) => {
  // Log received data for debugging
  console.log('🔍 Received pet data:', JSON.stringify(req.body, null, 2));
  console.log('🔍 User ID:', req.user._id);
  
  debugger; // 👈 This will ALWAYS pause here when debugging
  const pet = await petService.createPet(req.body, req.user._id);
  
  apiResponse.success(res, pet, 'Pet created successfully', 201);
});

/**
 * @desc    Get all pets for logged in user
 * @route   GET /api/v1/pets
 * @access  Private
 */
const getMyPets = asyncHandler(async (req, res) => {
  const includeCoOwned = req.query.includeCoOwned !== 'false';
  const pets = await petService.getUserPets(req.user._id, includeCoOwned);
  
  // Log for debugging
  console.log('🔍 Fetching pets for user:', req.user._id);
  console.log('🔍 Found pets:', pets.length);
  console.log('🔍 Pets data:', JSON.stringify(pets, null, 2));
  
  apiResponse.success(res, pets, 'Pets retrieved successfully');
});

/**
 * @desc    Get pet by ID
 * @route   GET /api/v1/pets/:id
 * @access  Private
 */
const getPetById = asyncHandler(async (req, res) => {
  console.log('🔍 Get pet by ID:', req.params.id);
  console.log('🔍 User ID:', req.user._id);
  
  const pet = await petService.getPetById(req.params.id, req.user._id);
  
  console.log('✅ Pet found:', pet.name);
  apiResponse.success(res, pet, 'Pet retrieved successfully');
});

/**
 * @desc    Update pet
 * @route   PUT /api/v1/pets/:id
 * @access  Private
 */
const updatePet = asyncHandler(async (req, res) => {
  const pet = await petService.updatePet(req.params.id, req.user._id, req.body);
  
  apiResponse.success(res, pet, 'Pet updated successfully');
});

/**
 * @desc    Delete pet
 * @route   DELETE /api/v1/pets/:id
 * @access  Private
 */
const deletePet = asyncHandler(async (req, res) => {
  console.log('🗑️ Delete request for pet:', req.params.id);
  console.log('🗑️ User ID:', req.user._id);
  
  const result = await petService.deletePet(req.params.id, req.user._id);
  
  console.log('✅ Pet deleted successfully');
  apiResponse.success(res, result, 'Pet deleted successfully');
});

/**
 * @desc    Add co-owner to pet
 * @route   POST /api/v1/pets/:id/co-owners
 * @access  Private
 */
const addCoOwner = asyncHandler(async (req, res) => {
  const pet = await petService.addCoOwner(req.params.id, req.user._id, req.body.email);
  
  apiResponse.success(res, pet, 'Co-owner added successfully');
});

/**
 * @desc    Remove co-owner from pet
 * @route   DELETE /api/v1/pets/:id/co-owners/:coOwnerId
 * @access  Private
 */
const removeCoOwner = asyncHandler(async (req, res) => {
  const pet = await petService.removeCoOwner(
    req.params.id,
    req.user._id,
    req.params.coOwnerId
  );
  
  apiResponse.success(res, pet, 'Co-owner removed successfully');
});

/**
 * @desc    Add photo to pet
 * @route   POST /api/v1/pets/:id/photos
 * @access  Private
 */
const addPhoto = asyncHandler(async (req, res) => {
  const pet = await petService.addPetPhoto(req.params.id, req.user._id, req.body.photoUrl);
  
  apiResponse.success(res, pet, 'Photo added successfully');
});

/**
 * @desc    Delete photo from pet
 * @route   DELETE /api/v1/pets/:id/photos
 * @access  Private
 */
const deletePhoto = asyncHandler(async (req, res) => {
  const pet = await petService.deletePetPhoto(req.params.id, req.user._id, req.body.photoUrl);
  
  apiResponse.success(res, pet, 'Photo deleted successfully');
});

/**
 * @desc    Add vaccination record
 * @route   POST /api/v1/pets/:id/vaccinations
 * @access  Private
 */
const addVaccination = asyncHandler(async (req, res) => {
  const pet = await petService.addVaccination(req.params.id, req.user._id, req.body);
  
  apiResponse.success(res, pet, 'Vaccination record added successfully');
});

/**
 * @desc    Update medical info
 * @route   PUT /api/v1/pets/:id/medical
 * @access  Private
 */
const updateMedicalInfo = asyncHandler(async (req, res) => {
  const pet = await petService.updateMedicalInfo(req.params.id, req.user._id, req.body);
  
  apiResponse.success(res, pet, 'Medical information updated successfully');
});

module.exports = {
  createPet,
  getMyPets,
  getPetById,
  updatePet,
  deletePet,
  addCoOwner,
  removeCoOwner,
  addPhoto,
  deletePhoto,
  addVaccination,
  updateMedicalInfo,
};

