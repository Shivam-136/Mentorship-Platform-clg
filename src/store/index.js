import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mentorReducer from './slices/mentorSlice';
import bookingReducer from './slices/bookingSlice';
import progressReducer from './slices/progressSlice';
import earningsReducer from './slices/earningsSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mentors: mentorReducer,
    bookings: bookingReducer,
    progress: progressReducer,
    earnings: earningsReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific actions if needed
        ignoredActions: [],
      },
    }),
});

export default store;

