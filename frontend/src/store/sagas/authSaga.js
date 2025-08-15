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
  setAuthenticated,
  setUnauthenticated,
} from '../reducers/authSlice';

// Login saga
function* loginSaga(action) {
  try {
    console.log('Login saga started with payload:', action.payload);
    yield put(loginStart());
    
    console.log('Making API call to login endpoint...');
    const response = yield call(authAPI.login, action.payload);
    console.log('Login API response:', response.data);
    
    yield put(loginSuccess(response.data));
    console.log('Login success action dispatched');
  } catch (error) {
    console.error('Login saga error:', error);
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response?.status === 401) {
      errorMessage = error.response?.data?.error || 'Invalid email or password';
    } else if (error.response?.status === 429) {
      errorMessage = error.response?.data?.error || 'Too many login attempts. Please wait a few minutes and try again.';
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
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
    const token = localStorage.getItem('token');
    yield put(setAuthenticated({ user: response.data.user, token }));
  } catch (error) {
    console.error('Get profile error:', error);
    // If token is invalid, logout
    if (error.response?.status === 401) {
      yield put(setUnauthenticated());
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