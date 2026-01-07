const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');
const businessValidator = require('../validators/business.validator');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');

// Import nested route handlers
const serviceRoutes = require('../../services/routes/service.routes');
const workerRoutes = require('../../workers/routes/worker.routes');

// Public routes
router.get('/search', businessValidator.validateSearchBusinesses, businessController.searchBusinesses);
router.get('/nearby', businessController.getNearbyBusinesses);
router.get('/featured', businessController.getFeaturedBusinesses);

// Get my business - MUST be before /:id route to avoid matching "my" as an ID
// This route requires authentication
router.get('/my/profile', protect, businessController.getMyBusiness);

// Public route for getting business by ID
router.get('/:id', businessController.getBusinessById);

// Protected routes - requires authentication for all routes below
router.use(protect);

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

// Nested routes for services and workers
// :businessId will be passed to the nested routers via mergeParams
router.use('/:businessId/services', serviceRoutes);
router.use('/:businessId/workers', workerRoutes);

module.exports = router;

