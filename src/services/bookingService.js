import { apiClient } from './apiClient';

/**
 * Booking & Session Management Service
 * Manages mentee bookings and mentor incoming session proposals.
 */
export const bookingService = {
  /**
   * Fetch mentee bookings
   */
  async getBookings(token) {
    return apiClient.get('/bookings', { token });
  },

  /**
   * Fetch single booking details
   */
  async getBookingById(bookingId, token) {
    return apiClient.get(`/bookings/${bookingId}`, { token });
  },

  /**
   * Submit new 1-on-1 booking proposal
   */
  async createBooking(bookingData, token) {
    return apiClient.post('/bookings', bookingData, { token });
  },

  /**
   * Cancel an existing booking
   */
  async cancelBooking(bookingId, reason, token) {
    return apiClient.put(`/bookings/${bookingId}/cancel`, { reason }, { token });
  },

  /**
   * Propose rescheduled time slot for an existing session
   */
  async rescheduleBooking(bookingId, rescheduleData, token) {
    return apiClient.put(`/bookings/${bookingId}/reschedule`, rescheduleData, { token });
  },

  /**
   * Retrieve incoming booking proposals (for mentor workspace)
   */
  async getIncomingRequests(token) {
    return apiClient.get('/mentor/booking-requests', { token });
  },

  /**
   * Mentor confirms booking proposal
   */
  async acceptBookingRequest(requestId, token) {
    return apiClient.put(`/mentor/booking-requests/${requestId}/accept`, null, { token });
  },

  /**
   * Mentor declines booking proposal
   */
  async declineBookingRequest(requestId, reason, token) {
    return apiClient.put(`/mentor/booking-requests/${requestId}/decline`, { reason }, { token });
  },
};

export default bookingService;

