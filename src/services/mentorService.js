import { apiClient } from './apiClient';

/**
 * Mentor Discovery & Management Service
 * Ready for future Express / MongoDB endpoints: GET /api/mentors, GET /api/mentors/:id, etc.
 */
export const mentorService = {
  /**
   * Search and filter verified mentors
   * @param {Object} params - { q, skill, sort, page, limit }
   */
  async getMentors(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.skill) searchParams.append('skill', params.skill);
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`/mentors${query}`);
  },

  /**
   * Retrieve single mentor profile by ID
   */
  async getMentorById(mentorId) {
    return apiClient.get(`/mentors/${mentorId}`);
  },

  /**
   * Retrieve mentor's published weekly availability schedule
   */
  async getMentorAvailability(mentorId) {
    return apiClient.get(`/mentors/${mentorId}/availability`);
  },

  /**
   * Update mentor's availability calendar slots (authenticated mentor only)
   */
  async updateAvailability(scheduleData, token) {
    return apiClient.put('/mentor/availability', scheduleData, { token });
  },

  /**
   * Retrieve session offerings/services published by a specific mentor
   */
  async getMentorServices(mentorId) {
    return apiClient.get(`/mentors/${mentorId}/services`);
  },
};

export default mentorService;

