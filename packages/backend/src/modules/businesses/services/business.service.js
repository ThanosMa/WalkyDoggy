const Business = require('../models/business.model');
const User = require('../../auth/models/user.model');

/**
 * Create a new business
 */
const createBusiness = async (businessData, ownerUserId) => {
  // Check if user already has a business
  const existingBusiness = await Business.findOne({ ownerUserId });
  
  if (existingBusiness) {
    throw new Error('You already have a business profile. Please update it instead.');
  }

  // Verify user is a business type
  const user = await User.findById(ownerUserId);
  if (user.userType !== 'business') {
    throw new Error('Only business accounts can create business profiles');
  }

  const business = new Business({
    ...businessData,
    ownerUserId,
  });

  await business.save();
  await business.populate('ownerUserId', 'email profile.firstName profile.lastName');
  
  return business;
};

/**
 * Get business by ID
 */
const getBusinessById = async (businessId) => {
  const business = await Business.findById(businessId)
    .populate('ownerUserId', 'email profile.firstName profile.lastName')
    .populate('services');

  if (!business) {
    throw new Error('Business not found');
  }

  // Increment view count
  business.views += 1;
  await business.save();

  return business;
};

/**
 * Get business by owner user ID
 */
const getBusinessByOwner = async (ownerUserId) => {
  const business = await Business.findOne({ ownerUserId })
    .populate('ownerUserId', 'email profile.firstName profile.lastName')
    .populate('services');

  if (!business) {
    throw new Error('No business profile found for this user');
  }

  return business;
};

/**
 * Update business
 */
const updateBusiness = async (businessId, userId, updateData) => {
  const business = await Business.findById(businessId);

  if (!business) {
    throw new Error('Business not found');
  }

  // Only owner can update business
  if (business.ownerUserId.toString() !== userId.toString()) {
    throw new Error('Only the business owner can update business information');
  }

  // Prevent changing owner
  delete updateData.ownerUserId;

  // Update fields
  Object.keys(updateData).forEach(key => {
    business[key] = updateData[key];
  });

  await business.save();
  await business.populate('ownerUserId', 'email profile.firstName profile.lastName');

  return business;
};

/**
 * Delete business
 */
const deleteBusiness = async (businessId, userId) => {
  const business = await Business.findById(businessId);

  if (!business) {
    throw new Error('Business not found');
  }

  // Only owner can delete business
  if (business.ownerUserId.toString() !== userId.toString()) {
    throw new Error('Only the business owner can delete the business');
  }

  business.status = 'closed';
  await business.save();

  return { message: 'Business closed successfully' };
};

/**
 * Search businesses
 */
const searchBusinesses = async (query, filters = {}, location = null, page = 1, limit = 20) => {
  const options = {
    status: 'active',
    ...filters,
  };

  // Text search
  if (query) {
    options.$text = { $search: query };
  }

  let businessQuery = Business.find(options);

  // Geospatial search if location provided
  if (location && location.latitude && location.longitude) {
    const maxDistance = location.radius || 50; // km
    
    businessQuery = Business.find({
      ...options,
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          $maxDistance: maxDistance * 1000, // Convert to meters
        },
      },
    });
  }

  // Sorting
  let sortOption = { featured: -1, 'rating.average': -1 };
  if (filters.sortBy === 'rating') {
    sortOption = { 'rating.average': -1, featured: -1 };
  } else if (filters.sortBy === 'newest') {
    sortOption = { createdAt: -1 };
  }

  const businesses = await businessQuery
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('services');

  const total = await Business.countDocuments(options);

  return {
    businesses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get nearby businesses
 */
const getNearbyBusinesses = async (longitude, latitude, maxDistanceKm = 50, limit = 20) => {
  const businesses = await Business.find({
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
    status: 'active',
  })
    .limit(limit)
    .populate('services');

  return businesses;
};

/**
 * Add certification to business
 */
const addCertification = async (businessId, userId, certificationData) => {
  const business = await Business.findById(businessId);

  if (!business) {
    throw new Error('Business not found');
  }

  if (business.ownerUserId.toString() !== userId.toString()) {
    throw new Error('Only the business owner can add certifications');
  }

  business.certifications.push(certificationData);
  await business.save();

  return business;
};

/**
 * Update operating hours
 */
const updateOperatingHours = async (businessId, userId, operatingHours) => {
  const business = await Business.findById(businessId);

  if (!business) {
    throw new Error('Business not found');
  }

  if (business.ownerUserId.toString() !== userId.toString()) {
    throw new Error('Only the business owner can update operating hours');
  }

  business.operatingHours = operatingHours;
  await business.save();

  return business;
};

/**
 * Update Stripe account ID
 */
const updateStripeAccount = async (businessId, userId, stripeAccountId, status) => {
  const business = await Business.findById(businessId);

  if (!business) {
    throw new Error('Business not found');
  }

  if (business.ownerUserId.toString() !== userId.toString()) {
    throw new Error('Only the business owner can update payment information');
  }

  business.stripeAccountId = stripeAccountId;
  business.stripeAccountStatus = status || 'pending';
  await business.save();

  return business;
};

/**
 * Get featured businesses
 */
const getFeaturedBusinesses = async (limit = 10) => {
  const businesses = await Business.find({
    status: 'active',
    featured: true,
  })
    .sort({ 'rating.average': -1 })
    .limit(limit)
    .populate('services');

  return businesses;
};

/**
 * Update business stats
 */
const updateBusinessStats = async (businessId, statsUpdate) => {
  const business = await Business.findById(businessId);

  if (!business) {
    throw new Error('Business not found');
  }

  Object.keys(statsUpdate).forEach(key => {
    if (business.stats[key] !== undefined) {
      business.stats[key] = statsUpdate[key];
    }
  });

  await business.save();
  return business;
};

module.exports = {
  createBusiness,
  getBusinessById,
  getBusinessByOwner,
  updateBusiness,
  deleteBusiness,
  searchBusinesses,
  getNearbyBusinesses,
  addCertification,
  updateOperatingHours,
  updateStripeAccount,
  getFeaturedBusinesses,
  updateBusinessStats,
};

