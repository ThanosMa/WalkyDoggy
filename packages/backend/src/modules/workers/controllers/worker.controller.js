const asyncHandler = require('../../../shared/utils/asyncHandler');
const apiResponse = require('../../../shared/utils/apiResponse');
const workerService = require('../services/worker.service');

/**
 * @desc    Create new worker
 * @route   POST /api/v1/businesses/:businessId/workers
 * @access  Private (business owner)
 */
const createWorker = asyncHandler(async (req, res) => {
  // Pass userId for individual businesses to auto-create owner as worker
  const worker = await workerService.createWorker(req.body, req.params.businessId, req.user._id);
  
  apiResponse.success(res, worker, 'Worker created successfully', 201);
});

/**
 * @desc    Get all workers for a business
 * @route   GET /api/v1/businesses/:businessId/workers
 * @access  Private (business owner)
 */
const getBusinessWorkers = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.isActive !== undefined) {
    filters.isActive = req.query.isActive === 'true';
  }
  if (req.query.isOnline !== undefined) {
    filters['status.isOnline'] = req.query.isOnline === 'true';
  }

  const workers = await workerService.getBusinessWorkers(req.params.businessId, filters);
  
  apiResponse.success(res, workers, 'Workers retrieved successfully');
});

/**
 * @desc    Get worker by ID
 * @route   GET /api/v1/workers/:id
 * @access  Public
 */
const getWorkerById = asyncHandler(async (req, res) => {
  const worker = await workerService.getWorkerById(req.params.id);
  
  apiResponse.success(res, worker, 'Worker retrieved successfully');
});

/**
 * @desc    Update worker
 * @route   PUT /api/v1/businesses/:businessId/workers/:id
 * @access  Private (business owner)
 */
const updateWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.updateWorker(
    req.params.id,
    req.params.businessId,
    req.body
  );
  
  apiResponse.success(res, worker, 'Worker updated successfully');
});

/**
 * @desc    Delete worker
 * @route   DELETE /api/v1/businesses/:businessId/workers/:id
 * @access  Private (business owner)
 */
const deleteWorker = asyncHandler(async (req, res) => {
  const result = await workerService.deleteWorker(req.params.id, req.params.businessId);
  
  apiResponse.success(res, result, 'Worker deleted successfully');
});

/**
 * @desc    Toggle worker active status
 * @route   PATCH /api/v1/businesses/:businessId/workers/:id/toggle
 * @access  Private (business owner)
 */
const toggleWorkerStatus = asyncHandler(async (req, res) => {
  const worker = await workerService.toggleWorkerStatus(req.params.id, req.params.businessId);
  
  apiResponse.success(res, worker, 'Worker status updated successfully');
});

/**
 * @desc    Update worker location
 * @route   PUT /api/v1/businesses/:businessId/workers/:id/location
 * @access  Private (business owner or worker)
 */
const updateWorkerLocation = asyncHandler(async (req, res) => {
  const { longitude, latitude } = req.body;
  const worker = await workerService.updateWorkerLocation(
    req.params.id,
    req.params.businessId,
    longitude,
    latitude
  );
  
  apiResponse.success(res, worker, 'Worker location updated successfully');
});

/**
 * @desc    Set worker online/offline status
 * @route   PUT /api/v1/businesses/:businessId/workers/:id/status
 * @access  Private (business owner or worker)
 */
const setWorkerOnlineStatus = asyncHandler(async (req, res) => {
  const { isOnline } = req.body;
  const worker = await workerService.setWorkerOnlineStatus(
    req.params.id,
    req.params.businessId,
    isOnline
  );
  
  apiResponse.success(res, worker, 'Worker status updated successfully');
});

/**
 * @desc    Get nearby online workers (for map view)
 * @route   GET /api/v1/workers/nearby
 * @access  Public
 */
const getNearbyOnlineWorkers = asyncHandler(async (req, res) => {
  const { longitude, latitude, maxDistance } = req.query;
  
  if (!longitude || !latitude) {
    return apiResponse.error(res, 'Longitude and latitude are required', 400);
  }

  const workers = await workerService.getNearbyOnlineWorkers(
    Number(longitude),
    Number(latitude),
    maxDistance ? Number(maxDistance) : 10
  );
  
  apiResponse.success(res, workers, 'Nearby workers retrieved successfully');
});

/**
 * @desc    Assign services to worker
 * @route   PUT /api/v1/businesses/:businessId/workers/:id/services
 * @access  Private (business owner)
 */
const assignServices = asyncHandler(async (req, res) => {
  const { serviceIds } = req.body;
  const worker = await workerService.assignServices(
    req.params.id,
    req.params.businessId,
    serviceIds
  );
  
  apiResponse.success(res, worker, 'Services assigned successfully');
});

/**
 * @desc    Add certification to worker
 * @route   POST /api/v1/businesses/:businessId/workers/:id/certifications
 * @access  Private (business owner)
 */
const addCertification = asyncHandler(async (req, res) => {
  const worker = await workerService.addCertification(
    req.params.id,
    req.params.businessId,
    req.body
  );
  
  apiResponse.success(res, worker, 'Certification added successfully');
});

/**
 * @desc    Update worker availability
 * @route   PUT /api/v1/businesses/:businessId/workers/:id/availability
 * @access  Private (business owner or worker)
 */
const updateAvailability = asyncHandler(async (req, res) => {
  const worker = await workerService.updateAvailability(
    req.params.id,
    req.params.businessId,
    req.body
  );
  
  apiResponse.success(res, worker, 'Availability updated successfully');
});

module.exports = {
  createWorker,
  getBusinessWorkers,
  getWorkerById,
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

