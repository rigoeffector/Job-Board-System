// Auth Actions
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST';
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';

// Jobs Actions
export const FETCH_JOBS_REQUEST = 'FETCH_JOBS_REQUEST';
export const FETCH_JOB_REQUEST = 'FETCH_JOB_REQUEST';
export const CREATE_JOB_REQUEST = 'CREATE_JOB_REQUEST';
export const UPDATE_JOB_REQUEST = 'UPDATE_JOB_REQUEST';
export const DELETE_JOB_REQUEST = 'DELETE_JOB_REQUEST';

// Applications Actions
export const FETCH_APPLICATIONS_REQUEST = 'FETCH_APPLICATIONS_REQUEST';
export const FETCH_APPLICATION_REQUEST = 'FETCH_APPLICATION_REQUEST';
export const SUBMIT_APPLICATION_REQUEST = 'SUBMIT_APPLICATION_REQUEST';
export const UPDATE_APPLICATION_STATUS_REQUEST = 'UPDATE_APPLICATION_STATUS_REQUEST';
export const DELETE_APPLICATION_REQUEST = 'DELETE_APPLICATION_REQUEST';
export const FETCH_JOB_APPLICATIONS_REQUEST = 'FETCH_JOB_APPLICATIONS_REQUEST';

// Auth Action Creators
export const loginRequest = (credentials) => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const registerRequest = (userData) => ({
  type: REGISTER_REQUEST,
  payload: userData,
});

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

export const getProfileRequest = () => ({
  type: GET_PROFILE_REQUEST,
});

export const updateProfileRequest = (profileData) => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: profileData,
});

// Jobs Action Creators
export const fetchJobsRequest = (filters = {}) => ({
  type: FETCH_JOBS_REQUEST,
  payload: filters,
});

export const fetchJobRequest = (id) => ({
  type: FETCH_JOB_REQUEST,
  payload: id,
});

export const createJobRequest = (jobData) => ({
  type: CREATE_JOB_REQUEST,
  payload: jobData,
});

export const updateJobRequest = (id, jobData) => ({
  type: UPDATE_JOB_REQUEST,
  payload: { id, jobData },
});

export const deleteJobRequest = (id) => ({
  type: DELETE_JOB_REQUEST,
  payload: id,
});

// Applications Action Creators
export const fetchApplicationsRequest = (filters = {}) => ({
  type: FETCH_APPLICATIONS_REQUEST,
  payload: filters,
});

export const fetchApplicationRequest = (id) => ({
  type: FETCH_APPLICATION_REQUEST,
  payload: id,
});

export const submitApplicationRequest = (applicationData) => ({
  type: SUBMIT_APPLICATION_REQUEST,
  payload: applicationData,
});

export const updateApplicationStatusRequest = (id, status) => ({
  type: UPDATE_APPLICATION_STATUS_REQUEST,
  payload: { id, status },
});

export const deleteApplicationRequest = (id) => ({
  type: DELETE_APPLICATION_REQUEST,
  payload: id,
});

export const fetchJobApplicationsRequest = (jobId) => ({
  type: FETCH_JOB_APPLICATIONS_REQUEST,
  payload: jobId,
});

// Additional action creators for slice actions
export const clearError = () => ({
  type: 'CLEAR_ERROR',
});

export const setFilters = (filters) => ({
  type: 'SET_FILTERS',
  payload: filters,
});

export const clearFilters = () => ({
  type: 'CLEAR_FILTERS',
});

export const setPage = (page) => ({
  type: 'SET_PAGE',
  payload: page,
}); 