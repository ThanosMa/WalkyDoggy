const Joi = require('joi');

const createServiceSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Service name is required',
    'any.required': 'Service name is required',
  }),
  // Support both short form (walking) and long form (dog_walking) categories
  category: Joi.string()
    .valid(
      'walking', 'dog_walking',
      'sitting', 'pet_sitting',
      'grooming',
      'training',
      'veterinary',
      'transportation', 'transport',
      'boarding',
      'daycare',
      'other'
    )
    .required()
    .messages({
      'any.only': 'Invalid service category',
      'any.required': 'Service category is required',
    }),
  description: Joi.string().max(2000).allow('').default(''),
  businessId: Joi.string(), // Passed from frontend but set by controller
  pricing: Joi.object({
    basePrice: Joi.number().min(0).required().messages({
      'number.base': 'Base price must be a number',
      'number.min': 'Base price cannot be negative',
      'any.required': 'Base price is required',
    }),
    currency: Joi.string().default('EUR'),
    // Support both priceType and pricingType
    priceType: Joi.string().valid('fixed', 'hourly', 'daily', 'per_visit', 'per_pet', 'custom'),
    pricingType: Joi.string().valid('fixed', 'hourly', 'daily', 'per_visit', 'per_pet', 'custom'),
    additionalRates: Joi.array().items(
      Joi.object({
        duration: Joi.number().min(1),
        price: Joi.number().min(0),
        description: Joi.string(),
      })
    ),
  }).required(),
  // Support both number and object formats for duration
  duration: Joi.alternatives().try(
    Joi.number().min(1),
    Joi.object({
      default: Joi.number().min(1).required(),
      min: Joi.number().min(1),
      max: Joi.number().min(1),
    })
  ).required(),
  // Pet requirements from simplified form
  petRequirements: Joi.object({
    petTypes: Joi.array().items(Joi.string()),
    minWeight: Joi.number().min(0).allow(null),
    maxWeight: Joi.number().min(0).allow(null),
  }),
  petTypes: Joi.array().items(
    Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'other')
  ),
  petSizes: Joi.array().items(
    Joi.string().valid('small', 'medium', 'large', 'extra-large')
  ),
  images: Joi.array().items(Joi.string().uri()),
  requirements: Joi.object({
    minAge: Joi.number().min(0),
    maxAge: Joi.number().min(0),
    vaccinations: Joi.array().items(Joi.string()),
    specialNeeds: Joi.string(),
  }),
  availability: Joi.object({
    daysOfWeek: Joi.array().items(Joi.number().min(0).max(6)),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    advanceBookingDays: Joi.number().min(0).default(7),
  }),
  capacity: Joi.object({
    maxPetsPerSession: Joi.number().min(1).default(1),
    maxSessionsPerDay: Joi.number().min(1).default(10),
  }),
  addOns: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().min(0).required(),
    })
  ),
  cancellationPolicy: Joi.string().max(1000),
  tags: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
  featured: Joi.boolean(),
  status: Joi.string().valid('active', 'inactive', 'draft'),
});

const updateServiceSchema = Joi.object({
  name: Joi.string().trim().max(100),
  category: Joi.string().valid(
    'dog_walking',
    'pet_sitting',
    'grooming',
    'training',
    'veterinary',
    'transportation',
    'boarding',
    'daycare',
    'other'
  ),
  description: Joi.string().max(2000),
  pricing: Joi.object({
    basePrice: Joi.number().min(0),
    currency: Joi.string(),
    pricingType: Joi.string().valid('fixed', 'hourly', 'daily', 'per_visit', 'custom'),
    additionalRates: Joi.array().items(
      Joi.object({
        duration: Joi.number().min(1),
        price: Joi.number().min(0),
        description: Joi.string(),
      })
    ),
  }),
  duration: Joi.object({
    default: Joi.number().min(1),
    min: Joi.number().min(1),
    max: Joi.number().min(1),
  }),
  petTypes: Joi.array().items(
    Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'other')
  ),
  petSizes: Joi.array().items(
    Joi.string().valid('small', 'medium', 'large', 'extra-large')
  ),
  images: Joi.array().items(Joi.string().uri()),
  requirements: Joi.object({
    minAge: Joi.number().min(0),
    maxAge: Joi.number().min(0),
    vaccinations: Joi.array().items(Joi.string()),
    specialNeeds: Joi.string(),
  }),
  availability: Joi.object({
    daysOfWeek: Joi.array().items(Joi.number().min(0).max(6)),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    advanceBookingDays: Joi.number().min(0),
  }),
  capacity: Joi.object({
    maxPetsPerSession: Joi.number().min(1),
    maxSessionsPerDay: Joi.number().min(1),
  }),
  addOns: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().min(0).required(),
    })
  ),
  cancellationPolicy: Joi.string().max(1000),
  tags: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
  featured: Joi.boolean(),
}).min(1);

const validateRequest = (schema) => {
  return (req, res, next) => {
    console.log('📋 Validating request body:', JSON.stringify(req.body, null, 2));
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      console.log('❌ Validation errors:', errors);
      
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
  validateCreateService: validateRequest(createServiceSchema),
  validateUpdateService: validateRequest(updateServiceSchema),
};

