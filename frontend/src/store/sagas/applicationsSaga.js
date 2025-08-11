import { takeLatest, call, put } from 'redux-saga/effects';
import { applicationsAPI } from '../../services/api';
import {
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATION_REQUEST,
  SUBMIT_APPLICATION_REQUEST,
  UPDATE_APPLICATION_STATUS_REQUEST,
  DELETE_APPLICATION_REQUEST,
  FETCH_JOB_APPLICATIONS_REQUEST,
} from '../actions';
import {
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
} from '../reducers/applicationsSlice';

// Fetch applications saga
function* fetchApplicationsSaga(action) {
  try {
    yield put(fetchApplicationsStart());
    const response = yield call(applicationsAPI.getApplications, action.payload);
    yield put(fetchApplicationsSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch applications';
    yield put(fetchApplicationsFailure(errorMessage));
  }
}

// Fetch single application saga
function* fetchApplicationSaga(action) {
  try {
    yield put(fetchApplicationStart());
    const response = yield call(applicationsAPI.getApplication, action.payload);
    yield put(fetchApplicationSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch application';
    yield put(fetchApplicationFailure(errorMessage));
  }
}

// Submit application saga
function* submitApplicationSaga(action) {
  try {
    yield put(submitApplicationStart());
    const response = yield call(applicationsAPI.submitApplication, action.payload);
    yield put(submitApplicationSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to submit application';
    yield put(submitApplicationFailure(errorMessage));
  }
}

// Update application status saga
function* updateApplicationStatusSaga(action) {
  try {
    yield put(updateApplicationStatusStart());
    const { id, status } = action.payload;
    const response = yield call(applicationsAPI.updateApplicationStatus, id, status);
    yield put(updateApplicationStatusSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to update application status';
    yield put(updateApplicationStatusFailure(errorMessage));
  }
}

// Delete application saga
function* deleteApplicationSaga(action) {
  try {
    yield put(deleteApplicationStart());
    yield call(applicationsAPI.deleteApplication, action.payload);
    yield put(deleteApplicationSuccess(action.payload));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to delete application';
    yield put(deleteApplicationFailure(errorMessage));
  }
}

// Fetch job applications saga
function* fetchJobApplicationsSaga(action) {
  try {
    yield put(fetchJobApplicationsStart());
    const response = yield call(applicationsAPI.getJobApplications, action.payload);
    yield put(fetchJobApplicationsSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch job applications';
    yield put(fetchJobApplicationsFailure(errorMessage));
  }
}

// Applications saga watcher
export default function* applicationsSaga() {
  yield takeLatest(FETCH_APPLICATIONS_REQUEST, fetchApplicationsSaga);
  yield takeLatest(FETCH_APPLICATION_REQUEST, fetchApplicationSaga);
  yield takeLatest(SUBMIT_APPLICATION_REQUEST, submitApplicationSaga);
  yield takeLatest(UPDATE_APPLICATION_STATUS_REQUEST, updateApplicationStatusSaga);
  yield takeLatest(DELETE_APPLICATION_REQUEST, deleteApplicationSaga);
  yield takeLatest(FETCH_JOB_APPLICATIONS_REQUEST, fetchJobApplicationsSaga);
} 