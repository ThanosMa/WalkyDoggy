const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');
const businessValidator = require('../validators/business.validator');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');

// Public routes
router.get('/search', businessValidator.validateSearchBusinesses, businessController.searchBusinesses);
router.get('/nearby', businessController.getNearbyBusinesses);
router.get('/featured', businessController.getFeaturedBusinesses);
router.get('/:id', businessController.getBusinessById);

// Protected routes - requires authentication
router.use(protect);

// Get my business
router.get('/my/profile', businessController.getMyBusiness);

// Create business (business users only)
router.post('/', authorize('business'), businessValidator.validateCreateBusiness, businessController.createBusiness);

// Update/delete business
router
  .route('/:id')
  .put(businessValidator.validateUpdateBusiness, businessController.updateBusiness)
  .delete(businessController.deleteBusiness);

// Certifications
router.post('/:id/certifications', businessValidator.validateAddCertification, businessController.addCertification);

// Operating hours
router.put('/:id/operating-hours', businessValidator.validateUpdateOperatingHours, businessController.updateOperatingHours);

// Stripe account
router.put('/:id/stripe', businessController.updateStripeAccount);

module.exports = router;

