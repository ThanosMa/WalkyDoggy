const jwtService = require('../../modules/auth/services/jwt.service');
const User = require('../../modules/auth/models/user.model');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes - require authentication
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.unauthorized(res, 'No token provided. Please login to access this resource.');
  }

  try {
    // Verify token
    const decoded = jwtService.verifyAccessToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.sub);
    if (!user) {
      return ApiResponse.unauthorized(res, 'User no longer exists');
    }

    // Check if user is active
    if (user.status !== 'active') {
      return ApiResponse.unauthorized(res, 'Your account has been suspended or deleted');
    }

    // Attach user to request
    req.user = decoded;
    req.user._id = decoded.sub; // Add _id for easier access
    req.user.email = user.email;

    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Invalid or expired token. Please login again.');
  }
});

/**
 * Authorize user types - restrict access based on user type
 * @param  {...string} userTypes - Array of allowed user types
 */
const authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    if (!userTypes.includes(req.user.userType)) {
      return ApiResponse.forbidden(
        res,
        `Access denied. This resource is only available to ${userTypes.join(', ')} users.`
      );
    }

    next();
  };
};

/**
 * Optional authentication - attach user if token is present, but don't require it
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // No token, continue without user
    return next();
  }

  try {
    // Verify token
    const decoded = jwtService.verifyAccessToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.sub);
    if (user && user.status === 'active') {
      // Attach user to request
      req.user = decoded;
      req.user._id = decoded.sub; // Add _id for easier access
      req.user.email = user.email;
    }
  } catch (error) {
    // Invalid token, but continue without user
    // Don't send error response for optional auth
  }

  next();
});

/**
 * Verify email required - ensure user has verified email
 */
const verifyEmailRequired = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  const user = await User.findById(req.user.sub);

  if (!user.isEmailVerified) {
    return ApiResponse.forbidden(res, 'Please verify your email address to access this resource');
  }

  next();
});

/**
 * Check if user owns resource or is admin
 * @param {string} resourceUserIdField - Field name containing user ID (e.g., 'userId', 'ownerId')
 */
const checkOwnership = resourceUserIdField => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    // Admin bypass
    if (req.user.userType === 'admin') {
      return next();
    }

    // Get resource user ID from params, body, or loaded resource
    const resourceUserId =
      req.params[resourceUserIdField] || req.body[resourceUserIdField] || req.resource?.[resourceUserIdField];

    if (!resourceUserId) {
      return ApiResponse.forbidden(res, 'Cannot determine resource ownership');
    }

    // Check if user owns the resource
    if (resourceUserId.toString() !== req.user.sub.toString()) {
      return ApiResponse.forbidden(res, 'You do not have permission to access this resource');
    }

    next();
  });
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  verifyEmailRequired,
  checkOwnership,
};

