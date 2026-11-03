import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState, STORAGE_KEYS } from '../../utils/storage';

const savedProgress = loadState(STORAGE_KEYS.USER_PROGRESS, {
  goals: [],
  milestones: [],
});

const initialState = {
  goals: savedProgress.goals || [],
  milestones: savedProgress.milestones || [],
  loading: false,
  error: null,
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      state.goals.push(action.payload);
      saveState(STORAGE_KEYS.USER_PROGRESS, {
        goals: state.goals,
        milestones: state.milestones,
      });
    },
    updateGoal: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.goals.findIndex((g) => g.id === id);
      if (index !== -1) {
        state.goals[index] = { ...state.goals[index], ...updates };
        saveState(STORAGE_KEYS.USER_PROGRESS, {
          goals: state.goals,
          milestones: state.milestones,
        });
      }
    },
    deleteGoal: (state, action) => {
      const id = action.payload;
      state.goals = state.goals.filter((g) => g.id !== id);
      state.milestones = state.milestones.filter((m) => m.goalId !== id);
      saveState(STORAGE_KEYS.USER_PROGRESS, {
        goals: state.goals,
        milestones: state.milestones,
      });
    },
    addMilestone: (state, action) => {
      state.milestones.push(action.payload);
      saveState(STORAGE_KEYS.USER_PROGRESS, {
        goals: state.goals,
        milestones: state.milestones,
      });
    },
    toggleMilestone: (state, action) => {
      const id = action.payload;
      const index = state.milestones.findIndex((m) => m.id === id);
      if (index !== -1) {
        state.milestones[index].completed = !state.milestones[index].completed;
        saveState(STORAGE_KEYS.USER_PROGRESS, {
          goals: state.goals,
          milestones: state.milestones,
        });
      }
    },
    setProgressLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProgressError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  addGoal,
  updateGoal,
  deleteGoal,
  addMilestone,
  toggleMilestone,
  setProgressLoading,
  setProgressError,
} = progressSlice.actions;

export default progressSlice.reducer;

