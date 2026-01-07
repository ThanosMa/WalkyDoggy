const asyncHandler = require('../../../shared/utils/asyncHandler');
const apiResponse = require('../../../shared/utils/apiResponse');
const serviceService = require('../services/service.service');

/**
 * @desc    Create new service
 * @route   POST /api/v1/businesses/:businessId/services
 * @access  Private (business owner)
 */
const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body, req.params.businessId);
  
  apiResponse.success(res, service, 'Service created successfully', 201);
});

/**
 * @desc    Get all services for a business
 * @route   GET /api/v1/businesses/:businessId/services
 * @access  Public
 */
const getBusinessServices = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.isActive !== undefined) {
    filters.isActive = req.query.isActive === 'true';
  }
  if (req.query.category) {
    filters.category = req.query.category;
  }

  const services = await serviceService.getBusinessServices(req.params.businessId, filters);
  
  apiResponse.success(res, services, 'Services retrieved successfully');
});

/**
 * @desc    Get service by ID
 * @route   GET /api/v1/services/:id
 * @access  Public
 */
const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);
  
  apiResponse.success(res, service, 'Service retrieved successfully');
});

/**
 * @desc    Update service
 * @route   PUT /api/v1/businesses/:businessId/services/:id
 * @access  Private (business owner)
 */
const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(
    req.params.id,
    req.params.businessId,
    req.body
  );
  
  apiResponse.success(res, service, 'Service updated successfully');
});

/**
 * @desc    Delete service
 * @route   DELETE /api/v1/businesses/:businessId/services/:id
 * @access  Private (business owner)
 */
const deleteService = asyncHandler(async (req, res) => {
  const result = await serviceService.deleteService(req.params.id, req.params.businessId);
  
  apiResponse.success(res, result, 'Service deleted successfully');
});

/**
 * @desc    Toggle service active status
 * @route   PATCH /api/v1/businesses/:businessId/services/:id/toggle
 * @access  Private (business owner)
 */
const toggleServiceStatus = asyncHandler(async (req, res) => {
  const service = await serviceService.toggleServiceStatus(req.params.id, req.params.businessId);
  
  apiResponse.success(res, service, 'Service status updated successfully');
});

/**
 * @desc    Search services
 * @route   GET /api/v1/services/search
 * @access  Public
 */
const searchServices = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  
  const filters = {};
  if (category) filters.category = category;
  if (minPrice) filters['pricing.basePrice'] = { $gte: Number(minPrice) };
  if (maxPrice) {
    filters['pricing.basePrice'] = filters['pricing.basePrice'] || {};
    filters['pricing.basePrice'].$lte = Number(maxPrice);
  }

  const services = await serviceService.searchServices(q, filters);
  
  apiResponse.success(res, services, 'Services retrieved successfully');
});

/**
 * @desc    Get services by category
 * @route   GET /api/v1/services/category/:category
 * @access  Public
 */
const getServicesByCategory = asyncHandler(async (req, res) => {
  const services = await serviceService.getServicesByCategory(req.params.category);
  
  apiResponse.success(res, services, 'Services retrieved successfully');
});

module.exports = {
  createService,
  getBusinessServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
  searchServices,
  getServicesByCategory,
};

