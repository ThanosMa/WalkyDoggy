const ApiResponse = require('../utils/apiResponse');

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};

module.exports = notFound;

