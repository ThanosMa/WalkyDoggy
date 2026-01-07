const Joi = require('joi');

const updateProfileSchema = Joi.object({
  profile: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    phoneNumber: Joi.string().trim(),
    avatar: Joi.string().uri(),
    address: Joi.object({
      street: Joi.string().allow(''),
      city: Joi.string().allow(''),
      state: Joi.string().allow(''),
      zipCode: Joi.string().allow(''),
      country: Joi.string().allow(''),
      coordinates: Joi.object({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2).required(), // [longitude, latitude]
      }).optional(),
    }),
  }),
  email: Joi.string().email(),
}).min(1);

const updateAvatarSchema = Joi.object({
  avatarUrl: Joi.string().uri().required().messages({
    'string.uri': 'Please provide a valid avatar URL',
    'any.required': 'Avatar URL is required',
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters',
    'any.required': 'New password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your new password',
  }),
});

const deleteAccountSchema = Joi.object({
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required to delete account',
  }),
  confirmation: Joi.string().valid('DELETE').required().messages({
    'any.only': 'Please type DELETE to confirm',
    'any.required': 'Confirmation is required',
  }),
});

const updatePhoneSchema = Joi.object({
  phoneNumber: Joi.string().trim().required().messages({
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required',
  }),
});

const updateAddressSchema = Joi.object({
  street: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  zipCode: Joi.string(),
  country: Joi.string(),
  coordinates: Joi.object({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }),
}).min(1);

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
  validateUpdateProfile: validateRequest(updateProfileSchema),
  validateUpdateAvatar: validateRequest(updateAvatarSchema),
  validateChangePassword: validateRequest(changePasswordSchema),
  validateDeleteAccount: validateRequest(deleteAccountSchema),
  validateUpdatePhone: validateRequest(updatePhoneSchema),
  validateUpdateAddress: validateRequest(updateAddressSchema),
};

