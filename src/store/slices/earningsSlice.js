import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState, STORAGE_KEYS } from '../../utils/storage';

const savedEarnings = loadState(STORAGE_KEYS.USER_EARNINGS, {
  transactions: [],
  payoutMethod: null,
});

const savedServices = loadState(STORAGE_KEYS.MENTOR_SERVICES, []);

const initialState = {
  services: savedServices,
  transactions: savedEarnings.transactions || [],
  payoutMethod: savedEarnings.payoutMethod || null,
  loading: false,
  error: null,
};

export const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload || [];
      saveState(STORAGE_KEYS.MENTOR_SERVICES, state.services);
    },
    addService: (state, action) => {
      state.services.push(action.payload);
      saveState(STORAGE_KEYS.MENTOR_SERVICES, state.services);
    },
    updateService: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.services.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.services[index] = { ...state.services[index], ...updates };
        saveState(STORAGE_KEYS.MENTOR_SERVICES, state.services);
      }
    },
    deleteService: (state, action) => {
      const id = action.payload;
      state.services = state.services.filter((s) => s.id !== id);
      saveState(STORAGE_KEYS.MENTOR_SERVICES, state.services);
    },
    setPayoutMethod: (state, action) => {
      // Never store full bank details or account numbers in localStorage
      const method = action.payload;
      const sanitized = method ? {
        accountName: method.accountName,
        bankName: method.bankName,
        accountMasked: method.accountNumber ? `•••• ${String(method.accountNumber).slice(-4)}` : '•••• 0000',
        status: method.status || 'Verified',
        updatedAt: new Date().toISOString(),
      } : null;

      state.payoutMethod = sanitized;
      saveState(STORAGE_KEYS.USER_EARNINGS, {
        transactions: state.transactions,
        payoutMethod: state.payoutMethod,
      });
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
      saveState(STORAGE_KEYS.USER_EARNINGS, {
        transactions: state.transactions,
        payoutMethod: state.payoutMethod,
      });
    },
    setEarningsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEarningsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setServices,
  addService,
  updateService,
  deleteService,
  setPayoutMethod,
  addTransaction,
  setEarningsLoading,
  setEarningsError,
} = earningsSlice.actions;

export default earningsSlice.reducer;
