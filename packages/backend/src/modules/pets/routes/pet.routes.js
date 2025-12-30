const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');
const petValidator = require('../validators/pet.validator');
const { protect } = require('../../../shared/middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Pet CRUD
router
  .route('/')
  .get(petController.getMyPets)
  .post(petValidator.validateCreatePet, petController.createPet);

router
  .route('/:id')
  .get(petController.getPetById)
  .put(petValidator.validateUpdatePet, petController.updatePet)
  .delete(petController.deletePet);

// Co-owners management
router
  .route('/:id/co-owners')
  .post(petValidator.validateAddCoOwner, petController.addCoOwner);

router
  .route('/:id/co-owners/:coOwnerId')
  .delete(petController.removeCoOwner);

// Photos management
router
  .route('/:id/photos')
  .post(petValidator.validateAddPhoto, petController.addPhoto)
  .delete(petController.deletePhoto);

// Medical records
router
  .route('/:id/vaccinations')
  .post(petValidator.validateAddVaccination, petController.addVaccination);

router
  .route('/:id/medical')
  .put(petController.updateMedicalInfo);

module.exports = router;

