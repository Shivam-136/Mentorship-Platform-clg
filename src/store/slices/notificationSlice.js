import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState, STORAGE_KEYS } from '../../utils/storage';

const savedNotifications = loadState(STORAGE_KEYS.USER_NOTIFICATIONS, []);

const initialState = {
  notifications: savedNotifications,
  loading: false,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload || [];
      saveState(STORAGE_KEYS.USER_NOTIFICATIONS, state.notifications);
    },
    addNotification: (state, action) => {
      const newNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        unread: true,
        ...action.payload,
      };
      state.notifications.unshift(newNotification);
      saveState(STORAGE_KEYS.USER_NOTIFICATIONS, state.notifications);
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const index = state.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        state.notifications[index].unread = false;
        saveState(STORAGE_KEYS.USER_NOTIFICATIONS, state.notifications);
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        unread: false,
      }));
      saveState(STORAGE_KEYS.USER_NOTIFICATIONS, state.notifications);
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter((n) => n.id !== id);
      saveState(STORAGE_KEYS.USER_NOTIFICATIONS, state.notifications);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      saveState(STORAGE_KEYS.USER_NOTIFICATIONS, []);
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

