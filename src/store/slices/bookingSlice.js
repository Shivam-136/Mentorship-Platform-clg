import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState, STORAGE_KEYS } from '../../utils/storage';

const savedBookings = loadState(STORAGE_KEYS.USER_BOOKINGS, []);
const savedRequests = loadState(STORAGE_KEYS.BOOKING_REQUESTS, []);

const initialState = {
  bookings: savedBookings,
  incomingRequests: savedRequests,
  loading: false,
  error: null,
};

export const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      // Backend-confirmed bookings
      state.bookings = (action.payload || []).map((item) => ({
        ...item,
        isLocal: false,
        syncStatus: 'synced',
      }));
      saveState(STORAGE_KEYS.USER_BOOKINGS, state.bookings);
    },
    addBooking: (state, action) => {
      // Locally saved user-created booking pending backend sync
      const userBooking = {
        ...action.payload,
        isLocal: true,
        syncStatus: action.payload.syncStatus || 'pending_sync',
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      state.bookings.unshift(userBooking);
      saveState(STORAGE_KEYS.USER_BOOKINGS, state.bookings);
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = status;
        saveState(STORAGE_KEYS.USER_BOOKINGS, state.bookings);
      }
    },
    cancelBooking: (state, action) => {
      const id = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = 'Cancelled';
        saveState(STORAGE_KEYS.USER_BOOKINGS, state.bookings);
      }
    },
    rescheduleBooking: (state, action) => {
      const { id, newDate, newTime, note } = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].date = newDate;
        state.bookings[index].time = newTime;
        state.bookings[index].rescheduleNote = note;
        state.bookings[index].status = 'Pending Confirmation';
        saveState(STORAGE_KEYS.USER_BOOKINGS, state.bookings);
      }
    },
    addReviewToBooking: (state, action) => {
      const { id, rating, feedback } = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].ratingGiven = rating;
        state.bookings[index].feedbackGiven = feedback;
        saveState(STORAGE_KEYS.USER_BOOKINGS, state.bookings);
      }
    },
    setIncomingRequests: (state, action) => {
      state.incomingRequests = (action.payload || []).map((item) => ({
        ...item,
        isLocal: false,
        syncStatus: 'synced',
      }));
      saveState(STORAGE_KEYS.BOOKING_REQUESTS, state.incomingRequests);
    },
    addIncomingRequest: (state, action) => {
      const userRequest = {
        ...action.payload,
        isLocal: true,
        syncStatus: action.payload.syncStatus || 'pending_sync',
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      state.incomingRequests.unshift(userRequest);
      saveState(STORAGE_KEYS.BOOKING_REQUESTS, state.incomingRequests);
    },
    acceptBookingRequest: (state, action) => {
      const reqId = action.payload;
      const reqIndex = state.incomingRequests.findIndex((r) => r.id === reqId);
      if (reqIndex !== -1) {
        const accepted = {
          ...state.incomingRequests[reqIndex],
          status: 'Confirmed',
        };
        state.incomingRequests.splice(reqIndex, 1);
        state.bookings.unshift(accepted);
        saveState(STORAGE_KEYS.BOOKING_REQUESTS, state.incomingRequests);
        saveState(STORAGE_KEYS.USER_BOOKINGS, state.bookings);
      }
    },
    declineBookingRequest: (state, action) => {
      const reqId = action.payload;
      state.incomingRequests = state.incomingRequests.filter((r) => r.id !== reqId);
      saveState(STORAGE_KEYS.BOOKING_REQUESTS, state.incomingRequests);
    },
    setBookingsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookingsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setBookings,
  addBooking,
  updateBookingStatus,
  cancelBooking,
  rescheduleBooking,
  addReviewToBooking,
  setIncomingRequests,
  addIncomingRequest,
  acceptBookingRequest,
  declineBookingRequest,
  setBookingsLoading,
  setBookingsError,
} = bookingSlice.actions;

export default bookingSlice.reducer;

