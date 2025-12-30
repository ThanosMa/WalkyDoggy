/**
 * Standard API response format
 */
class ApiResponse {
  /**
   * Success response
   */
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Success response with pagination
   */
  static successWithPagination(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit),
      },
    });
  }

  /**
   * Error response
   */
  static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Not found response
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  /**
   * Validation error response
   */
  static validationError(res, errors) {
    return this.error(res, 'Validation failed', 422, errors);
  }

  /**
   * Unauthorized response
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden response
   */
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }
}

module.exports = ApiResponse;

