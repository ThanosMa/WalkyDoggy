const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access businessId from parent router
const workerController = require('../controllers/worker.controller');
const workerValidator = require('../validators/worker.validator');
const { protect } = require('../../../shared/middleware/auth.middleware');

// Public routes
router.get('/nearby', workerController.getNearbyOnlineWorkers);
router.get('/:id', workerController.getWorkerById);

// Routes for business workers (nested under /businesses/:businessId/workers)
// These require authentication and business ownership
router.get('/', protect, workerController.getBusinessWorkers);
router.post(
  '/',
  protect,
  workerValidator.validateCreateWorker,
  workerController.createWorker
);
router.put(
  '/:id',
  protect,
  workerValidator.validateUpdateWorker,
  workerController.updateWorker
);
router.delete('/:id', protect, workerController.deleteWorker);
router.patch('/:id/toggle', protect, workerController.toggleWorkerStatus);

// Worker location and status
router.put(
  '/:id/location',
  protect,
  workerValidator.validateUpdateLocation,
  workerController.updateWorkerLocation
);
router.put(
  '/:id/status',
  protect,
  workerValidator.validateSetOnlineStatus,
  workerController.setWorkerOnlineStatus
);

// Worker services and certifications
router.put(
  '/:id/services',
  protect,
  workerValidator.validateAssignServices,
  workerController.assignServices
);
router.post('/:id/certifications', protect, workerController.addCertification);

// Worker availability
router.put('/:id/availability', protect, workerController.updateAvailability);

module.exports = router;

