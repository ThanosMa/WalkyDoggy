const Service = require('../models/service.model');
const Business = require('../../businesses/models/business.model');

/**
 * Create a new service for a business
 */
const createService = async (serviceData, businessId) => {
  // Verify business exists and user owns it
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  const service = new Service({
    ...serviceData,
    businessId,
  });

  await service.save();
  return service;
};

/**
 * Get all services for a business
 */
const getBusinessServices = async (businessId, filters = {}) => {
  const query = { businessId, ...filters };
  
  const services = await Service.find(query)
    .sort({ featured: -1, 'rating.average': -1, createdAt: -1 });

  return services;
};

/**
 * Get service by ID
 */
const getServiceById = async (serviceId) => {
  const service = await Service.findById(serviceId)
    .populate('businessId', 'name logo rating contactInfo address');

  if (!service) {
    throw new Error('Service not found');
  }

  return service;
};

/**
 * Update service
 */
const updateService = async (serviceId, businessId, updateData) => {
  const service = await Service.findOne({ _id: serviceId, businessId });

  if (!service) {
    throw new Error('Service not found or unauthorized');
  }

  Object.keys(updateData).forEach(key => {
    service[key] = updateData[key];
  });

  await service.save();
  return service;
};

/**
 * Delete service
 */
const deleteService = async (serviceId, businessId) => {
  const service = await Service.findOne({ _id: serviceId, businessId });

  if (!service) {
    throw new Error('Service not found or unauthorized');
  }

  await Service.findByIdAndDelete(serviceId);
  return { message: 'Service deleted successfully' };
};

/**
 * Toggle service active status
 */
const toggleServiceStatus = async (serviceId, businessId) => {
  const service = await Service.findOne({ _id: serviceId, businessId });

  if (!service) {
    throw new Error('Service not found or unauthorized');
  }

  service.isActive = !service.isActive;
  await service.save();

  return service;
};

/**
 * Search services
 */
const searchServices = async (query, filters = {}) => {
  const searchQuery = {
    isActive: true,
    ...filters,
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  const services = await Service.find(searchQuery)
    .populate('businessId', 'name logo rating address')
    .sort({ featured: -1, 'rating.average': -1 })
    .limit(50);

  return services;
};

/**
 * Get services by category
 */
const getServicesByCategory = async (category, filters = {}) => {
  const services = await Service.find({
    category,
    isActive: true,
    ...filters,
  })
    .populate('businessId', 'name logo rating address')
    .sort({ featured: -1, 'rating.average': -1 });

  return services;
};

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

