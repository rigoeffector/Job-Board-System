import { takeLatest, call, put } from 'redux-saga/effects';
import { jobsAPI } from '../../services/api';
import {
  FETCH_JOBS_REQUEST,
  FETCH_JOB_REQUEST,
  CREATE_JOB_REQUEST,
  UPDATE_JOB_REQUEST,
  DELETE_JOB_REQUEST,
} from '../actions';
import {
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
} from '../reducers/jobsSlice';

// Fetch jobs saga
function* fetchJobsSaga(action) {
  try {
    yield put(fetchJobsStart());
    const response = yield call(jobsAPI.getJobs, action.payload);
    yield put(fetchJobsSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch jobs';
    yield put(fetchJobsFailure(errorMessage));
  }
}

// Fetch single job saga
function* fetchJobSaga(action) {
  try {
    yield put(fetchJobStart());
    const response = yield call(jobsAPI.getJob, action.payload);
    yield put(fetchJobSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch job';
    yield put(fetchJobFailure(errorMessage));
  }
}

// Create job saga
function* createJobSaga(action) {
  try {
    yield put(createJobStart());
    const response = yield call(jobsAPI.createJob, action.payload);
    yield put(createJobSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to create job';
    yield put(createJobFailure(errorMessage));
  }
}

// Update job saga
function* updateJobSaga(action) {
  try {
    yield put(updateJobStart());
    const { id, jobData } = action.payload;
    const response = yield call(jobsAPI.updateJob, id, jobData);
    yield put(updateJobSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to update job';
    yield put(updateJobFailure(errorMessage));
  }
}

// Delete job saga
function* deleteJobSaga(action) {
  try {
    yield put(deleteJobStart());
    yield call(jobsAPI.deleteJob, action.payload);
    yield put(deleteJobSuccess(action.payload));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to delete job';
    yield put(deleteJobFailure(errorMessage));
  }
}

// Jobs saga watcher
export default function* jobsSaga() {
  yield takeLatest(FETCH_JOBS_REQUEST, fetchJobsSaga);
  yield takeLatest(FETCH_JOB_REQUEST, fetchJobSaga);
  yield takeLatest(CREATE_JOB_REQUEST, createJobSaga);
  yield takeLatest(UPDATE_JOB_REQUEST, updateJobSaga);
  yield takeLatest(DELETE_JOB_REQUEST, deleteJobSaga);
} 