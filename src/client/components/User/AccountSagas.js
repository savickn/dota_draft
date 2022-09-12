
import { takeLatest, call, put, fork } from "redux-saga/effects";
import { push } from 'connected-react-router';

import axios from '../../util/axiosCaller';
import { setAuthToken, removeAuthToken } from '../../util/AuthService';
import { LOG_IN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST } from './AccountActions';


function getMe() {
  return axios.get(`/api/users/me`)
  .then(res => res.data)
  .catch((err) => { throw err; })
}

// function that makes the api request and returns a Promise for response
function login(credentials) {
  return axios.post('auth/local/', {
    email: credentials.email,
    password: credentials.password
  })
  .then((res) => res.data)
  .catch((err) => { throw err; })
}

/* LOGIN */

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* loginWatcher() {
  yield takeLatest(LOG_IN, loginHandler);
}

// worker saga: makes the api call when watcher saga sees the action
function* loginHandler(action) {
  try {
    yield put({ type: "LOG_IN_REQUEST" });
    const loginResponse = yield call(login, action.credentials);
    console.log('login response --> ', loginResponse);
    yield call(setAuthToken, loginResponse.token); // used to set Auth token in localStorage and set Auth header
    yield put({type: 'TOKEN_AUTH'});
    yield put({type: 'NEW_ALERT', alert: { type: 'success', message: 'You are logged in!' }});

    // redirect back to protectedPage or to homePage
    const protectedRoute = localStorage.getItem('ProtectedRoute');
    protectedRoute ? yield put(push(protectedRoute)) : yield put(push('/'));
  } catch (error) {
    yield call(removeAuthToken);
    console.log('error --> ', error);
    yield put({ type: "LOG_IN_FAILURE", error });
  }
}

/* AUTH */

export function* authWatcher() {
  yield takeLatest('TOKEN_AUTH', authHandler);
}

export function* authHandler(action) {
  try {
    yield put({ type: "LOG_IN_REQUEST" });
    const getMeResponse = yield call(getMe);
    console.log('getMe response --> ', getMeResponse);
    yield put({ type: "LOG_IN_SUCCESS", user: getMeResponse });
  } catch (error) {
    yield call(removeAuthToken);
    console.log('error --> ', error);
    yield put({ type: "LOG_IN_FAILURE", error });
    yield put({type: 'NEW_ALERT', alert: { type: 'danger', message: 'Error! Unable to retrieve current user!' }});
  }
}

/* LOGOUT */

export function* logoutWatcher() {
  yield takeLatest('LOG_OUT', logoutHandler);
}

export function* logoutHandler(action) {
  try {
    yield call(removeAuthToken);
    yield put({type: 'LOG_OUT_SUCCESS'});
    yield put({type: 'NEW_ALERT', alert: { type: 'success', message: 'You are logged out!' }});
  } catch(error) {
    console.log(error);
    yield put({ type: "LOG_OUT_FAILURE", error });
    yield put({type: 'NEW_ALERT', alert: { type: 'danger', message: 'Error! Unable to log out!' }});
  }
}


export default [
  fork(loginWatcher),
  fork(logoutWatcher),
  fork(authWatcher),
];
