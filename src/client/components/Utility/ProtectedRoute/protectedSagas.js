
export const AUTH_STATUS = 'AUTH_STATUS';

import { takeEvery, put, select, fork, call } from 'redux-saga/effects';

function* authWatcher() {
  yield takeEvery(AUTH_STATUS, authHandler);
}

function* authHandler(action) {
  
}

export default [
  fork(authWatcher),
]
