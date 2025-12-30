import api from './api';

const authService = {
  /**
   * Register new user
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken() {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  /**
   * Verify email
   */
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password
   */
  async resetPassword(token, password, confirmPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail() {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },
};

export default authService;

