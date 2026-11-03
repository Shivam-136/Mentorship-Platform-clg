import { apiClient } from './apiClient';

/**
 * Authentication Service
 * Prepares endpoints for future Node.js / Express / MongoDB JWT authentication.
 */
export const authService = {
  /**
   * Log in user with email and password
   */
  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Register new user (mentee or mentor)
   */
  async register(registrationData) {
    return apiClient.post('/auth/register', registrationData);
  },

  /**
   * Terminate current session
   */
  async logout(token) {
    return apiClient.post('/auth/logout', null, { token });
  },

  /**
   * Fetch currently authenticated user profile
   */
  async getCurrentUser(token) {
    return apiClient.get('/auth/me', { token });
  },

  /**
   * Initiate password reset workflow
   */
  async forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Complete password reset with verification token
   */
  async resetPassword({ token, newPassword }) {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  /**
   * Update profile details
   */
  async updateProfile(profileData, token) {
    return apiClient.put('/auth/profile', profileData, { token });
  },
};

export default authService;

