import { apiClient } from './apiClient';

/**
 * Mentor Earnings, Services & Payouts Service
 */
export const earningsService = {
  /**
   * Fetch earnings overview metrics and payout schedule
   */
  async getEarningsSummary(token) {
    return apiClient.get('/mentor/earnings', { token });
  },

  /**
   * Fetch transaction ledger
   */
  async getTransactions(token) {
    return apiClient.get('/mentor/transactions', { token });
  },

  /**
   * Connect or update direct deposit payout account
   */
  async setPayoutMethod(payoutData, token) {
    return apiClient.post('/mentor/payout-method', payoutData, { token });
  },

  /**
   * Retrieve active session packages created by current mentor
   */
  async getServices(token) {
    return apiClient.get('/mentor/services', { token });
  },

  /**
   * Create new session offering package
   */
  async createService(serviceData, token) {
    return apiClient.post('/mentor/services', serviceData, { token });
  },

  /**
   * Update existing session package
   */
  async updateService(serviceId, updates, token) {
    return apiClient.put(`/mentor/services/${serviceId}`, updates, { token });
  },

  /**
   * Remove session offering
   */
  async deleteService(serviceId, token) {
    return apiClient.delete(`/mentor/services/${serviceId}`, { token });
  },
};

export default earningsService;

