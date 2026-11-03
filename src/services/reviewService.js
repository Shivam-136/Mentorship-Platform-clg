import { apiClient } from './apiClient';

/**
 * Reviews & Feedback Service
 * Manages testimonials, ratings, and mentor evaluations.
 */
export const reviewService = {
  /**
   * Fetch reviews published for a specific mentor
   */
  async getMentorReviews(mentorId) {
    return apiClient.get(`/mentors/${mentorId}/reviews`);
  },

  /**
   * Fetch reviews written by current mentee
   */
  async getMenteeReviews(token) {
    return apiClient.get('/mentee/reviews', { token });
  },

  /**
   * Submit new review following completed session
   */
  async submitReview(reviewData, token) {
    return apiClient.post('/reviews', reviewData, { token });
  },
};

export default reviewService;

