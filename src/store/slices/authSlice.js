import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState, removeState, STORAGE_KEYS } from '../../utils/storage';

// Initialize session metadata only from user-created profile (NEVER raw tokens or passwords in localStorage)
const savedSession = loadState(STORAGE_KEYS.AUTH_SESSION, null);

const initialState = {
  user: savedSession?.user || null,
  token: null, // Tokens are strictly kept in-memory, never persisted to localStorage
  role: savedSession?.role || null, // 'mentee' | 'mentor' | null
  isAuthenticated: Boolean(savedSession?.user),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      const { user, token, role } = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token || null;
      state.role = role || user?.role || 'mentee';
      state.error = null;

      // Persist only non-sensitive user identity; never store tokens or passwords in localStorage
      saveState(STORAGE_KEYS.AUTH_SESSION, {
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          role: state.role,
          avatar: user?.avatar || null,
          title: user?.title || user?.roleTitle || '',
          bio: user?.bio || '',
        },
        role: state.role,
      });
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      removeState(STORAGE_KEYS.AUTH_SESSION);
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveState(STORAGE_KEYS.AUTH_SESSION, {
          user: {
            id: state.user.id,
            name: state.user.name,
            email: state.user.email,
            role: state.role,
            avatar: state.user.avatar || null,
            title: state.user.title || state.user.roleTitle || '',
            bio: state.user.bio || '',
          },
          role: state.role,
        });
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logout,
  updateUserProfile,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
