const asyncHandler = require('../../../shared/utils/asyncHandler');
const apiResponse = require('../../../shared/utils/apiResponse');
const businessService = require('../services/business.service');

/**
 * @desc    Create new business
 * @route   POST /api/v1/businesses
 * @access  Private (Business users only)
 */
const createBusiness = asyncHandler(async (req, res) => {
  const business = await businessService.createBusiness(req.body, req.user._id);
  
  apiResponse.success(res, business, 'Business created successfully', 201);
});

/**
 * @desc    Get business by ID
 * @route   GET /api/v1/businesses/:id
 * @access  Public
 */
const getBusinessById = asyncHandler(async (req, res) => {
  const business = await businessService.getBusinessById(req.params.id);
  
  apiResponse.success(res, business, 'Business retrieved successfully');
});

/**
 * @desc    Get my business (logged in business owner)
 * @route   GET /api/v1/businesses/my/profile
 * @access  Private
 */
const getMyBusiness = asyncHandler(async (req, res) => {
  try {
    const business = await businessService.getBusinessByOwner(req.user._id);
    apiResponse.success(res, business, 'Business retrieved successfully');
  } catch (error) {
    // If no business found, return 404 with clear message
    if (error.message.includes('No business profile found')) {
      return apiResponse.error(res, 'No business profile found. Create one to get started!', 404);
    }
    throw error;
  }
});

/**
 * @desc    Update business
 * @route   PUT /api/v1/businesses/:id
 * @access  Private
 */
const updateBusiness = asyncHandler(async (req, res) => {
  const business = await businessService.updateBusiness(req.params.id, req.user._id, req.body);
  
  apiResponse.success(res, business, 'Business updated successfully');
});

/**
 * @desc    Delete business
 * @route   DELETE /api/v1/businesses/:id
 * @access  Private
 */
const deleteBusiness = asyncHandler(async (req, res) => {
  const result = await businessService.deleteBusiness(req.params.id, req.user._id);
  
  apiResponse.success(res, result, 'Business closed successfully');
});

/**
 * @desc    Search businesses
 * @route   GET /api/v1/businesses/search
 * @access  Public
 */
const searchBusinesses = asyncHandler(async (req, res) => {
  const { query, latitude, longitude, radius, sortBy, page, limit, isVerified, featured } = req.query;
  
  const filters = {};
  if (isVerified !== undefined) filters.isVerified = isVerified === 'true';
  if (featured !== undefined) filters.featured = featured === 'true';
  if (sortBy) filters.sortBy = sortBy;
  
  const location = latitude && longitude ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude), radius: radius ? parseFloat(radius) : 50 } : null;
  
  const result = await businessService.searchBusinesses(
    query,
    filters,
    location,
    parseInt(page) || 1,
    parseInt(limit) || 20
  );
  
  apiResponse.success(res, result, 'Businesses retrieved successfully');
});

/**
 * @desc    Get nearby businesses
 * @route   GET /api/v1/businesses/nearby
 * @access  Public
 */
const getNearbyBusinesses = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius } = req.query;
  
  if (!latitude || !longitude) {
    return apiResponse.error(res, 'Latitude and longitude are required', 400);
  }
  
  const businesses = await businessService.getNearbyBusinesses(
    parseFloat(longitude),
    parseFloat(latitude),
    radius ? parseFloat(radius) : 50
  );
  
  apiResponse.success(res, businesses, 'Nearby businesses retrieved successfully');
});

/**
 * @desc    Get featured businesses
 * @route   GET /api/v1/businesses/featured
 * @access  Public
 */
const getFeaturedBusinesses = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const businesses = await businessService.getFeaturedBusinesses(limit);
  
  apiResponse.success(res, businesses, 'Featured businesses retrieved successfully');
});

/**
 * @desc    Add certification
 * @route   POST /api/v1/businesses/:id/certifications
 * @access  Private
 */
const addCertification = asyncHandler(async (req, res) => {
  const business = await businessService.addCertification(req.params.id, req.user._id, req.body);
  
  apiResponse.success(res, business, 'Certification added successfully');
});

/**
 * @desc    Update operating hours
 * @route   PUT /api/v1/businesses/:id/operating-hours
 * @access  Private
 */
const updateOperatingHours = asyncHandler(async (req, res) => {
  const business = await businessService.updateOperatingHours(req.params.id, req.user._id, req.body);
  
  apiResponse.success(res, business, 'Operating hours updated successfully');
});

/**
 * @desc    Update Stripe account
 * @route   PUT /api/v1/businesses/:id/stripe
 * @access  Private
 */
const updateStripeAccount = asyncHandler(async (req, res) => {
  const { stripeAccountId, status } = req.body;
  const business = await businessService.updateStripeAccount(req.params.id, req.user._id, stripeAccountId, status);
  
  apiResponse.success(res, business, 'Payment information updated successfully');
});

module.exports = {
  createBusiness,
  getBusinessById,
  getMyBusiness,
  updateBusiness,
  deleteBusiness,
  searchBusinesses,
  getNearbyBusinesses,
  getFeaturedBusinesses,
  addCertification,
  updateOperatingHours,
  updateStripeAccount,
};

