import { apiClient } from './apiClient';

/**
 * System Notifications Service
 */
export const notificationService = {
  /**
   * Retrieve notification stream
   */
  async getNotifications(token) {
    return apiClient.get('/notifications', { token });
  },

  /**
   * Mark individual notification as read
   */
  async markAsRead(notificationId, token) {
    return apiClient.patch(`/notifications/${notificationId}/read`, null, { token });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(token) {
    return apiClient.post('/notifications/mark-all-read', null, { token });
  },

  /**
   * Delete or clear notifications
   */
  async clearNotifications(token) {
    return apiClient.delete('/notifications', { token });
  },
};

export default notificationService;

