import { apiClient } from './apiClient';

/**
 * Mentorship Progress & Goal Tracking Service
 */
export const progressService = {
  /**
   * Fetch mentee career goals and milestones
   */
  async getProgress(token) {
    return apiClient.get('/mentee/progress', { token });
  },

  /**
   * Create new objective goal
   */
  async createGoal(goalData, token) {
    return apiClient.post('/mentee/goals', goalData, { token });
  },

  /**
   * Update goal details or category
   */
  async updateGoal(goalId, updates, token) {
    return apiClient.put(`/mentee/goals/${goalId}`, updates, { token });
  },

  /**
   * Delete career goal
   */
  async deleteGoal(goalId, token) {
    return apiClient.delete(`/mentee/goals/${goalId}`, { token });
  },

  /**
   * Add actionable milestone to a goal
   */
  async addMilestone(milestoneData, token) {
    return apiClient.post('/mentee/milestones', milestoneData, { token });
  },

  /**
   * Toggle completion state of a milestone
   */
  async toggleMilestone(milestoneId, completed, token) {
    return apiClient.patch(`/mentee/milestones/${milestoneId}`, { completed }, { token });
  },
};

export default progressService;

