const Joi = require('joi');

const createBusinessSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Business name is required',
    'any.required': 'Business name is required',
  }),
  description: Joi.string().max(2000),
  businessType: Joi.string().valid('individual', 'company', 'franchise'),
  logo: Joi.string().uri(),
  coverPhoto: Joi.string().uri(),
  photos: Joi.array().items(Joi.string().uri()),
  contactInfo: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    website: Joi.string().uri(),
  }).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string(),
    coordinates: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required(), // [longitude, latitude]
    }).required(),
  }).required(),
  serviceArea: Joi.object({
    type: Joi.string().valid('Polygon', 'Point'),
    coordinates: Joi.array(),
    radiusInKm: Joi.number().min(1).max(100),
  }),
  operatingHours: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().min(0).max(6).required(),
      openTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      closeTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      isClosed: Joi.boolean(),
    })
  ),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      issuedBy: Joi.string(),
      issueDate: Joi.date(),
      expiryDate: Joi.date(),
      document: Joi.string().uri(),
    })
  ),
  insurance: Joi.object({
    provider: Joi.string(),
    policyNumber: Joi.string(),
    coverageAmount: Joi.number(),
    expiryDate: Joi.date(),
    document: Joi.string().uri(),
  }),
  businessLicense: Joi.object({
    number: Joi.string(),
    issueDate: Joi.date(),
    expiryDate: Joi.date(),
    document: Joi.string().uri(),
  }),
  pricing: Joi.object({
    currency: Joi.string(),
    acceptsCash: Joi.boolean(),
    acceptsCard: Joi.boolean(),
  }),
  settings: Joi.object({
    instantBooking: Joi.boolean(),
    requireApproval: Joi.boolean(),
    advanceBookingDays: Joi.number().min(1).max(365),
    cancellationPolicy: Joi.string().max(1000),
  }),
});

const updateBusinessSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().max(2000),
  businessType: Joi.string().valid('individual', 'company', 'franchise'),
  logo: Joi.string().uri(),
  coverPhoto: Joi.string().uri(),
  photos: Joi.array().items(Joi.string().uri()),
  contactInfo: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string(),
    website: Joi.string().uri(),
  }),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string(),
    coordinates: Joi.object({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2),
    }),
  }),
  serviceArea: Joi.object({
    type: Joi.string().valid('Polygon', 'Point'),
    coordinates: Joi.array(),
    radiusInKm: Joi.number().min(1).max(100),
  }),
  operatingHours: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().min(0).max(6).required(),
      openTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      closeTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      isClosed: Joi.boolean(),
    })
  ),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      issuedBy: Joi.string(),
      issueDate: Joi.date(),
      expiryDate: Joi.date(),
      document: Joi.string().uri(),
    })
  ),
  insurance: Joi.object({
    provider: Joi.string(),
    policyNumber: Joi.string(),
    coverageAmount: Joi.number(),
    expiryDate: Joi.date(),
    document: Joi.string().uri(),
  }),
  businessLicense: Joi.object({
    number: Joi.string(),
    issueDate: Joi.date(),
    expiryDate: Joi.date(),
    document: Joi.string().uri(),
  }),
  pricing: Joi.object({
    currency: Joi.string(),
    acceptsCash: Joi.boolean(),
    acceptsCard: Joi.boolean(),
  }),
  settings: Joi.object({
    instantBooking: Joi.boolean(),
    requireApproval: Joi.boolean(),
    advanceBookingDays: Joi.number().min(1).max(365),
    cancellationPolicy: Joi.string().max(1000),
  }),
  status: Joi.string().valid('pending', 'active', 'suspended', 'closed'),
}).min(1);

const searchBusinessesSchema = Joi.object({
  query: Joi.string().allow(''),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  radius: Joi.number().min(1).max(200),
  sortBy: Joi.string().valid('rating', 'distance', 'newest'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
  isVerified: Joi.boolean(),
  featured: Joi.boolean(),
});

const addCertificationSchema = Joi.object({
  name: Joi.string().required(),
  issuedBy: Joi.string(),
  issueDate: Joi.date(),
  expiryDate: Joi.date(),
  document: Joi.string().uri(),
});

const updateOperatingHoursSchema = Joi.array()
  .items(
    Joi.object({
      dayOfWeek: Joi.number().min(0).max(6).required(),
      openTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      closeTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      isClosed: Joi.boolean(),
    })
  )
  .required();

const validateRequest = (schema) => {
  return (req, res, next) => {
    const dataToValidate = req.method === 'GET' ? req.query : req.body;
    const { error } = schema.validate(dataToValidate, { abortEarly: false });
    
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
  validateCreateBusiness: validateRequest(createBusinessSchema),
  validateUpdateBusiness: validateRequest(updateBusinessSchema),
  validateSearchBusinesses: validateRequest(searchBusinessesSchema),
  validateAddCertification: validateRequest(addCertificationSchema),
  validateUpdateOperatingHours: validateRequest(updateOperatingHoursSchema),
};

