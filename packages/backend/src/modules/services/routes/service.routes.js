const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access businessId from parent router
const serviceController = require('../controllers/service.controller');
const serviceValidator = require('../validators/service.validator');
const { protect } = require('../../../shared/middleware/auth.middleware');

// Public routes
router.get('/search', serviceController.searchServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);

// Routes for business services (nested under /businesses/:businessId/services)
// These require authentication and business ownership
router.get('/', serviceController.getBusinessServices);
router.post(
  '/',
  protect,
  serviceValidator.validateCreateService,
  serviceController.createService
);
router.put(
  '/:id',
  protect,
  serviceValidator.validateUpdateService,
  serviceController.updateService
);
router.delete('/:id', protect, serviceController.deleteService);
router.patch('/:id/toggle', protect, serviceController.toggleServiceStatus);

module.exports = router;

