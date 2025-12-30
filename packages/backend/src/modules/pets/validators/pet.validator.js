const Joi = require('joi');

const createPetSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Pet name is required',
    'any.required': 'Pet name is required',
  }),
  species: Joi.string()
    .valid('dog', 'cat', 'bird', 'rabbit', 'other')
    .required()
    .messages({
      'any.only': 'Species must be one of: dog, cat, bird, rabbit, other',
      'any.required': 'Species is required',
    }),
  breed: Joi.string().trim().allow(''),
  age: Joi.number().min(0).max(100),
  birthDate: Joi.date().max('now'),
  gender: Joi.string().valid('male', 'female', 'unknown'),
  weight: Joi.number().min(0).max(500),
  size: Joi.string().valid('small', 'medium', 'large', 'extra-large'),
  color: Joi.string().trim(),
  photos: Joi.array().items(Joi.string().uri()),
  medicalInfo: Joi.object({
    vaccinations: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        date: Joi.date().required(),
        expiryDate: Joi.date(),
        document: Joi.string().uri(),
      })
    ),
    allergies: Joi.array().items(Joi.string()),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        dosage: Joi.string(),
        frequency: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
      })
    ),
    conditions: Joi.array().items(Joi.string()),
    specialNeeds: Joi.string().max(1000),
    vetInfo: Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      email: Joi.string().email(),
      address: Joi.string(),
    }),
  }),
  behavior: Joi.object({
    temperament: Joi.string().allow(''),
    goodWithKids: Joi.boolean(),
    goodWithDogs: Joi.boolean(),
    goodWithCats: Joi.boolean(),
    energyLevel: Joi.string().valid('low', 'medium', 'high', 'very-high').allow(''),
    trainingLevel: Joi.string().valid('none', 'basic', 'intermediate', 'advanced').allow(''),
    specialBehaviors: Joi.array().items(Joi.string()),
  }),
  microchipId: Joi.string().trim(),
  registrationNumber: Joi.string().trim(),
  insurance: Joi.object({
    provider: Joi.string(),
    policyNumber: Joi.string(),
    expiryDate: Joi.date(),
  }),
  notes: Joi.string().max(1000),
});

const updatePetSchema = Joi.object({
  name: Joi.string().trim(),
  species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'other'),
  breed: Joi.string().trim(),
  age: Joi.number().min(0).max(100),
  birthDate: Joi.date().max('now'),
  gender: Joi.string().valid('male', 'female', 'unknown'),
  weight: Joi.number().min(0).max(500),
  size: Joi.string().valid('small', 'medium', 'large', 'extra-large'),
  color: Joi.string().trim(),
  photos: Joi.array().items(Joi.string().uri()),
  medicalInfo: Joi.object({
    vaccinations: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        date: Joi.date().required(),
        expiryDate: Joi.date(),
        document: Joi.string().uri(),
      })
    ),
    allergies: Joi.array().items(Joi.string()),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        dosage: Joi.string(),
        frequency: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
      })
    ),
    conditions: Joi.array().items(Joi.string()),
    specialNeeds: Joi.string().max(1000),
    vetInfo: Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      email: Joi.string().email(),
      address: Joi.string(),
    }),
  }),
  behavior: Joi.object({
    temperament: Joi.string().allow(''),
    goodWithKids: Joi.boolean(),
    goodWithDogs: Joi.boolean(),
    goodWithCats: Joi.boolean(),
    energyLevel: Joi.string().valid('low', 'medium', 'high', 'very-high').allow(''),
    trainingLevel: Joi.string().valid('none', 'basic', 'intermediate', 'advanced').allow(''),
    specialBehaviors: Joi.array().items(Joi.string()),
  }),
  microchipId: Joi.string().trim(),
  registrationNumber: Joi.string().trim(),
  insurance: Joi.object({
    provider: Joi.string(),
    policyNumber: Joi.string(),
    expiryDate: Joi.date(),
  }),
  status: Joi.string().valid('active', 'deceased', 'rehomed', 'lost'),
  notes: Joi.string().max(1000),
}).min(1);

const addCoOwnerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

const addPhotoSchema = Joi.object({
  photoUrl: Joi.string().uri().required().messages({
    'string.uri': 'Please provide a valid photo URL',
    'any.required': 'Photo URL is required',
  }),
});

const addVaccinationSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().required(),
  expiryDate: Joi.date(),
  document: Joi.string().uri(),
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    // Log what we're validating
    console.log('🔍 Validating pet data:', JSON.stringify(req.body, null, 2));
    
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      console.log('❌ Validation errors:', error.details);
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
  validateCreatePet: validateRequest(createPetSchema),
  validateUpdatePet: validateRequest(updatePetSchema),
  validateAddCoOwner: validateRequest(addCoOwnerSchema),
  validateAddPhoto: validateRequest(addPhotoSchema),
  validateAddVaccination: validateRequest(addVaccinationSchema),
};

