const Joi = require('joi');

// For individual businesses, profile is optional (pulled from user account)
// For company/franchise, profile is required
const createWorkerSchema = Joi.object({
  profile: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().email(),
    phone: Joi.string(),
    avatar: Joi.string().uri().allow(''),
    bio: Joi.string().max(1000),
    dateOfBirth: Joi.date(),
  }),
  // Simple fields for individual business owners
  specializations: Joi.array().items(Joi.string()),
  bio: Joi.string().max(1000),
  hourlyRate: Joi.number().min(0),
  assignedServices: Joi.array().items(Joi.string()),
  // Legacy specialization enum (still supported)
  specializationsEnum: Joi.array().items(
    Joi.string().valid(
      'dog_walking',
      'pet_sitting',
      'grooming',
      'training',
      'veterinary',
      'transportation',
      'boarding',
      'daycare',
      'behavioral_training',
      'emergency_care',
      'senior_pet_care',
      'puppy_care'
    )
  ),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      issuedBy: Joi.string(),
      issueDate: Joi.date(),
      expiryDate: Joi.date(),
      document: Joi.string().uri(),
    })
  ),
  experience: Joi.object({
    years: Joi.number().min(0),
    description: Joi.string(),
  }),
  availability: Joi.object({
    schedule: Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().min(0).max(6).required(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        isAvailable: Joi.boolean().default(true),
      })
    ),
  }),
  emergencyContact: Joi.object({
    name: Joi.string(),
    relationship: Joi.string(),
    phone: Joi.string(),
  }),
  paymentInfo: Joi.object({
    hourlyRate: Joi.number().min(0),
    paymentMethod: Joi.string().valid('direct_deposit', 'check', 'cash', 'paypal'),
  }),
  hireDate: Joi.date(),
});

const updateWorkerSchema = Joi.object({
  profile: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().email(),
    phone: Joi.string(),
    avatar: Joi.string().uri().allow(''),
    bio: Joi.string().max(1000),
    dateOfBirth: Joi.date(),
  }),
  // Simple fields for individual business owners
  specializations: Joi.array().items(Joi.string()),
  bio: Joi.string().max(1000),
  hourlyRate: Joi.number().min(0),
  assignedServices: Joi.array().items(Joi.string()),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      issuedBy: Joi.string(),
      issueDate: Joi.date(),
      expiryDate: Joi.date(),
      document: Joi.string().uri(),
    })
  ),
  experience: Joi.object({
    years: Joi.number().min(0),
    description: Joi.string(),
  }),
  availability: Joi.object({
    schedule: Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().min(0).max(6).required(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        isAvailable: Joi.boolean(),
      })
    ),
    timeOff: Joi.array().items(
      Joi.object({
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        reason: Joi.string(),
      })
    ),
  }),
  emergencyContact: Joi.object({
    name: Joi.string(),
    relationship: Joi.string(),
    phone: Joi.string(),
  }),
  paymentInfo: Joi.object({
    hourlyRate: Joi.number().min(0),
    paymentMethod: Joi.string().valid('direct_deposit', 'check', 'cash', 'paypal'),
  }),
  isActive: Joi.boolean(),
}).min(1);

const updateLocationSchema = Joi.object({
  longitude: Joi.number().min(-180).max(180).required().messages({
    'any.required': 'Longitude is required',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'any.required': 'Latitude is required',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
  }),
});

const setOnlineStatusSchema = Joi.object({
  isOnline: Joi.boolean().required().messages({
    'any.required': 'Online status is required',
  }),
});

const assignServicesSchema = Joi.object({
  serviceIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one service must be provided',
    'any.required': 'Service IDs are required',
  }),
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    
    next();
  };
};

module.exports = {
  validateCreateWorker: validateRequest(createWorkerSchema),
  validateUpdateWorker: validateRequest(updateWorkerSchema),
  validateUpdateLocation: validateRequest(updateLocationSchema),
  validateSetOnlineStatus: validateRequest(setOnlineStatusSchema),
  validateAssignServices: validateRequest(assignServicesSchema),
};

