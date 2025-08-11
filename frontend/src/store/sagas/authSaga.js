import { takeLatest, call, put } from 'redux-saga/effects';
import { authAPI } from '../../services/api';
import {
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  GET_PROFILE_REQUEST,
  UPDATE_PROFILE_REQUEST,
} from '../actions';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateProfile,
} from '../reducers/authSlice';

// Login saga
function* loginSaga(action) {
  try {
    yield put(loginStart());
    const response = yield call(authAPI.login, action.payload);
    yield put(loginSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Login failed';
    yield put(loginFailure(errorMessage));
  }
}

// Register saga
function* registerSaga(action) {
  try {
    yield put(registerStart());
    const response = yield call(authAPI.register, action.payload);
    yield put(registerSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Registration failed';
    yield put(registerFailure(errorMessage));
  }
}

// Logout saga
function* logoutSaga() {
  try {
    yield put(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Get profile saga
function* getProfileSaga() {
  try {
    const response = yield call(authAPI.getProfile);
    yield put(loginSuccess({ user: response.data.user, token: localStorage.getItem('token') }));
  } catch (error) {
    console.error('Get profile error:', error);
    // If token is invalid, logout
    if (error.response?.status === 401) {
      yield put(logout());
    }
  }
}

// Update profile saga
function* updateProfileSaga(action) {
  try {
    const response = yield call(authAPI.updateProfile, action.payload);
    yield put(updateProfile(response.data.user));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Profile update failed';
    console.error('Update profile error:', errorMessage);
  }
}

// Auth saga watcher
export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(REGISTER_REQUEST, registerSaga);
  yield takeLatest(LOGOUT_REQUEST, logoutSaga);
  yield takeLatest(GET_PROFILE_REQUEST, getProfileSaga);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileSaga);
} 