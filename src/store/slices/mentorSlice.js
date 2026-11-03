import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mentors: [],
  selectedMentor: null,
  filters: {
    query: '',
    skill: '',
    sort: 'rating',
  },
  loading: false,
  error: null,
};

export const mentorSlice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    setMentors: (state, action) => {
      state.mentors = action.payload || [];
      state.loading = false;
      state.error = null;
    },
    setSelectedMentor: (state, action) => {
      state.selectedMentor = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.query = action.payload;
    },
    setSelectedSkill: (state, action) => {
      state.filters.skill = action.payload;
    },
    setSelectedSort: (state, action) => {
      state.filters.sort = action.payload;
    },
    resetFilters: (state) => {
      state.filters.query = '';
      state.filters.skill = '';
      state.filters.sort = 'rating';
    },
    setMentorsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMentorsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setMentors,
  setSelectedMentor,
  setSearchQuery,
  setSelectedSkill,
  setSelectedSort,
  resetFilters,
  setMentorsLoading,
  setMentorsError,
} = mentorSlice.actions;

export default mentorSlice.reducer;

