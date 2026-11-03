import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  activeModal: null, // { type: string, props: object }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const toast = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: action.payload.type || 'info', // 'success' | 'error' | 'warning' | 'info'
        title: action.payload.title || '',
        message: action.payload.message || '',
        duration: action.payload.duration || 4000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { addToast, removeToast, clearToasts, openModal, closeModal } = uiSlice.actions;

export default uiSlice.reducer;

