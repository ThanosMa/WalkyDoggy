const Worker = require('../models/worker.model');
const Business = require('../../businesses/models/business.model');
const User = require('../../auth/models/user.model');

/**
 * Create a new worker for a business
 * For individual businesses, the owner becomes the worker automatically
 */
const createWorker = async (workerData, businessId, userId = null) => {
  // Verify business exists
  const business = await Business.findById(businessId).populate('ownerUserId');
  if (!business) {
    throw new Error('Business not found');
  }

  // For individual businesses, auto-create worker profile from owner's user account
  if (business.businessType === 'individual' && userId) {
    // Check if owner already has a worker profile
    const existingWorker = await Worker.findOne({ businessId, userId });
    if (existingWorker) {
      throw new Error('You already have a worker profile for this business');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const worker = new Worker({
      businessId,
      userId,
      profile: {
        firstName: user.profile?.firstName || 'Owner',
        lastName: user.profile?.lastName || '',
        email: user.email,
        phone: user.profile?.phone || business.contactInfo?.phone || '',
        bio: workerData.bio || '',
        avatar: user.profile?.avatar || '',
      },
      specializations: workerData.specializations || [],
      services: workerData.assignedServices || [],
      hourlyRate: workerData.hourlyRate || null,
      isActive: true,
      status: {
        isOnline: false,
        isAvailable: true,
      },
    });

    await worker.save();
    await worker.populate('userId', 'email profile.firstName profile.lastName profile.avatar');
    return worker;
  }

  // For company/franchise - create worker with provided profile
  if (!workerData.profile || !workerData.profile.email) {
    throw new Error('Worker profile with email is required');
  }

  // Check if email already exists for this business
  const existingWorker = await Worker.findOne({
    businessId,
    'profile.email': workerData.profile.email,
  });

  if (existingWorker) {
    throw new Error('Worker with this email already exists in your business');
  }

  // Try to find existing user with this email and link them
  const existingUser = await User.findOne({ email: workerData.profile.email });

  const worker = new Worker({
    ...workerData,
    businessId,
    userId: existingUser?._id || null,
  });

  await worker.save();
  if (worker.userId) {
    await worker.populate('userId', 'email profile.firstName profile.lastName profile.avatar');
  }
  return worker;
};

/**
 * Get all workers for a business
 */
const getBusinessWorkers = async (businessId, filters = {}) => {
  const query = { businessId, ...filters };
  
  const workers = await Worker.find(query)
    .populate('userId', 'email profile.firstName profile.lastName profile.avatar')
    .populate('services', 'name category')
    .sort({ 'rating.average': -1, createdAt: -1 });

  return workers;
};

/**
 * Get worker by ID
 */
const getWorkerById = async (workerId) => {
  const worker = await Worker.findById(workerId)
    .populate('businessId', 'name logo')
    .populate('services', 'name category pricing');

  if (!worker) {
    throw new Error('Worker not found');
  }

  return worker;
};

/**
 * Update worker
 */
const updateWorker = async (workerId, businessId, updateData) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  // Handle specific fields
  if (updateData.specializations !== undefined) {
    worker.specializations = updateData.specializations;
  }
  if (updateData.bio !== undefined) {
    worker.profile.bio = updateData.bio;
  }
  if (updateData.hourlyRate !== undefined) {
    worker.hourlyRate = updateData.hourlyRate;
  }
  if (updateData.assignedServices !== undefined) {
    worker.services = updateData.assignedServices;
  }
  
  // Handle profile updates
  if (updateData.profile) {
    worker.profile = {
      ...worker.profile.toObject(),
      ...updateData.profile,
    };
  }

  // Handle other fields
  const handledKeys = ['specializations', 'bio', 'hourlyRate', 'assignedServices', 'profile'];
  Object.keys(updateData).forEach(key => {
    if (!handledKeys.includes(key)) {
      worker[key] = updateData[key];
    }
  });

  await worker.save();
  await worker.populate('userId', 'email profile.firstName profile.lastName profile.avatar');
  await worker.populate('services', 'name category');
  return worker;
};

/**
 * Delete worker
 */
const deleteWorker = async (workerId, businessId) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  await Worker.findByIdAndDelete(workerId);
  return { message: 'Worker deleted successfully' };
};

/**
 * Toggle worker active status
 */
const toggleWorkerStatus = async (workerId, businessId) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  worker.isActive = !worker.isActive;
  if (!worker.isActive) {
    worker.setOnlineStatus(false); // Force offline if deactivated
  }
  await worker.save();

  return worker;
};

/**
 * Update worker location (for map tracking)
 */
const updateWorkerLocation = async (workerId, businessId, longitude, latitude) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  worker.updateLocation(longitude, latitude);
  await worker.save();

  return worker;
};

/**
 * Set worker online/offline status
 */
const setWorkerOnlineStatus = async (workerId, businessId, isOnline) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  worker.setOnlineStatus(isOnline);
  await worker.save();

  return worker;
};

/**
 * Get online workers nearby (for map view)
 */
const getNearbyOnlineWorkers = async (longitude, latitude, maxDistanceKm = 10) => {
  const workers = await Worker.findNearbyOnline(longitude, latitude, maxDistanceKm)
    .populate('businessId', 'name logo rating')
    .populate('services', 'name category pricing');

  return workers;
};

/**
 * Assign services to worker
 */
const assignServices = async (workerId, businessId, serviceIds) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  worker.services = serviceIds;
  await worker.save();
  await worker.populate('services', 'name category pricing');

  return worker;
};

/**
 * Add certification to worker
 */
const addCertification = async (workerId, businessId, certificationData) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  worker.certifications.push(certificationData);
  await worker.save();

  return worker;
};

/**
 * Update worker availability schedule
 */
const updateAvailability = async (workerId, businessId, availabilityData) => {
  const worker = await Worker.findOne({ _id: workerId, businessId });

  if (!worker) {
    throw new Error('Worker not found or unauthorized');
  }

  worker.availability = {
    ...worker.availability,
    ...availabilityData,
  };

  await worker.save();
  return worker;
};

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

