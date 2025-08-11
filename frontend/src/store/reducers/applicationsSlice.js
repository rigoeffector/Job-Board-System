import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    job_id: '',
    status: '',
  },
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload.applications;
      state.pagination = action.payload.pagination;
    },
    fetchApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchApplicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationSuccess: (state, action) => {
      state.loading = false;
      state.currentApplication = action.payload.application;
    },
    fetchApplicationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    submitApplicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitApplicationSuccess: (state, action) => {
      state.loading = false;
      state.applications.unshift(action.payload.application);
    },
    submitApplicationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateApplicationStatusStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateApplicationStatusSuccess: (state, action) => {
      state.loading = false;
      const index = state.applications.findIndex(app => app.id === action.payload.application.id);
      if (index !== -1) {
        state.applications[index] = action.payload.application;
      }
      if (state.currentApplication && state.currentApplication.id === action.payload.application.id) {
        state.currentApplication = action.payload.application;
      }
    },
    updateApplicationStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteApplicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteApplicationSuccess: (state, action) => {
      state.loading = false;
      state.applications = state.applications.filter(app => app.id !== action.payload);
      if (state.currentApplication && state.currentApplication.id === action.payload) {
        state.currentApplication = null;
      }
    },
    deleteApplicationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchJobApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchJobApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload.applications;
    },
    fetchJobApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
});

export const {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchApplicationsFailure,
  fetchApplicationStart,
  fetchApplicationSuccess,
  fetchApplicationFailure,
  submitApplicationStart,
  submitApplicationSuccess,
  submitApplicationFailure,
  updateApplicationStatusStart,
  updateApplicationStatusSuccess,
  updateApplicationStatusFailure,
  deleteApplicationStart,
  deleteApplicationSuccess,
  deleteApplicationFailure,
  fetchJobApplicationsStart,
  fetchJobApplicationsSuccess,
  fetchJobApplicationsFailure,
  setFilters,
  clearFilters,
  setPage,
  clearError,
  clearCurrentApplication,
} = applicationsSlice.actions;

export default applicationsSlice.reducer; 