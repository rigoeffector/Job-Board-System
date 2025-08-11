import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import jobsSaga from './jobsSaga';
import applicationsSaga from './applicationsSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    jobsSaga(),
    applicationsSaga(),
  ]);
} 