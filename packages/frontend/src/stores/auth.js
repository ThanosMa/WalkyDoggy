import { defineStore } from 'pinia';
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  }),

  getters: {
    /**
     * Get user full name
     */
    userFullName: state => {
      if (!state.user) return '';
      return `${state.user.profile.firstName} ${state.user.profile.lastName}`;
    },

    /**
     * Check if user is pet owner
     */
    isPetOwner: state => {
      return state.user?.userType === 'pet_owner';
    },

    /**
     * Check if user is business
     */
    isBusiness: state => {
      return state.user?.userType === 'business';
    },

    /**
     * Check if user is admin
     */
    isAdmin: state => {
      return state.user?.userType === 'admin';
    },

    /**
     * Check if email is verified
     */
    isEmailVerified: state => {
      return state.user?.isEmailVerified || false;
    },
  },

  actions: {
    /**
     * Initialize auth state from localStorage
     */
    initializeAuth() {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        this.accessToken = token;
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      }
    },

    /**
     * Register new user
     */
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.register(userData);
        
        this.user = response.user;
        this.accessToken = response.accessToken;
        this.isAuthenticated = true;

        // Save to localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response;
      } catch (error) {
        this.error = error.message || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Login user
     */
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);
        
        this.user = response.user;
        this.accessToken = response.accessToken;
        this.isAuthenticated = true;

        // Save to localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response;
      } catch (error) {
        this.error = error.message || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout user
     */
    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear state regardless of API call success
        this.user = null;
        this.accessToken = null;
        this.isAuthenticated = false;
        this.error = null;

        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    },

    /**
     * Fetch current user
     */
    async fetchCurrentUser() {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.getCurrentUser();
        this.user = response.user;
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.user));

        return response.user;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user';
        // If fetch fails, clear auth
        await this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Verify email
     */
    async verifyEmail(token) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.verifyEmail(token);
        
        // Update user in state
        if (this.user) {
          this.user.isEmailVerified = true;
          localStorage.setItem('user', JSON.stringify(this.user));
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Email verification failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Request password reset
     */
    async forgotPassword(email) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.forgotPassword(email);
        return response;
      } catch (error) {
        this.error = error.message || 'Password reset request failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Reset password
     */
    async resetPassword(token, password, confirmPassword) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.resetPassword(token, password, confirmPassword);
        return response;
      } catch (error) {
        this.error = error.message || 'Password reset failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword, confirmPassword) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.changePassword(currentPassword, newPassword, confirmPassword);
        
        // Logout after password change
        await this.logout();

        return response;
      } catch (error) {
        this.error = error.message || 'Password change failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    },
  },
});

