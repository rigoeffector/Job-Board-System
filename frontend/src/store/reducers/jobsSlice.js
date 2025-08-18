import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    title: '',
    location: '',
    type: '',
    status: 'active',
  },
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    fetchJobsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchJobsSuccess: (state, action) => {
      state.loading = false;
      state.jobs = action.payload.jobs;
      state.pagination = action.payload.pagination;
    },
    fetchJobsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchJobStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchJobSuccess: (state, action) => {
      state.loading = false;
      state.currentJob = action.payload.job;
    },
    fetchJobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createJobStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createJobSuccess: (state, action) => {
      state.loading = false;
      state.jobs.unshift(action.payload.job);
    },
    createJobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateJobStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateJobSuccess: (state, action) => {
      state.loading = false;
      const index = state.jobs.findIndex(job => job.id === action.payload.job.id);
      if (index !== -1) {
        state.jobs[index] = action.payload.job;
      }
      if (state.currentJob && state.currentJob.id === action.payload.job.id) {
        state.currentJob = action.payload.job;
      }
    },
    updateJobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteJobStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteJobSuccess: (state, action) => {
      state.loading = false;
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
      if (state.currentJob && state.currentJob.id === action.payload) {
        state.currentJob = null;
      }
    },
    deleteJobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
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
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
});

export const {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  fetchJobStart,
  fetchJobSuccess,
  fetchJobFailure,
  createJobStart,
  createJobSuccess,
  createJobFailure,
  updateJobStart,
  updateJobSuccess,
  updateJobFailure,
  deleteJobStart,
  deleteJobSuccess,
  deleteJobFailure,
  setFilters,
  clearFilters,
  setPage,
  clearError,
  clearCurrentJob,
} = jobsSlice.actions;

export default jobsSlice.reducer; 