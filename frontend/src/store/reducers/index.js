import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import jobsReducer from './jobsSlice';
import applicationsReducer from './applicationsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobsReducer,
  applications: applicationsReducer,
});

export default rootReducer; 