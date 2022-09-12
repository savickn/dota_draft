
import { SIGN_UP_REQUEST, FETCH_USERS_REQUEST, UPDATE_USER_REQUEST, DELETE_USER_REQUEST, } from './UserActions';

import {
  signUpSuccess, signUpFailure,
  fetchUsersSuccess, fetchUsersFailure,
  updateUserSuccess, updateUserFailure,
  deleteUserSuccess, deleteUserFailure,
} from './UserActions';

import axios from '../../util/axiosCaller';
import { setAuthToken } from '../../util/AuthService';
import { takeLatest, put, call, fork } from 'redux-saga/effects';

/* AJAX REQUESTS */

const fetchUsersAjax = (query) => {
  return axios.get('api/users/', { params: query })
  .then(res => res.data)
  .catch((err) => { throw err; })
}

const addUserAjax = (user) => {
  return axios.post('api/users/', user)
  .then(res => res.data )
  .catch(err => { throw err; })
}

const updateUserAjax = (user) => {
  return axios.put(`api/users/${user._id}`, user)
  .then(res => res.data)
  .catch(err => { throw err; })
}

const deleteUserAjax = (userId) => {
  return axios.delete(`api/users/${userId}`)
  .then(res => res.data)
  .catch(err => { throw err; })
}

/* FETCH USERS */

export function* fetchUsersWatcher() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersHandler);
}


function* fetchUsersHandler(action) {
  try {
    const response = yield call(fetchUsersAjax, action.query);
    yield put(fetchUsersSuccess(response.users));
  } catch (err) {
    console.log('Err --> ', err);
    yield put(fetchUsersFailure(err));
  }
}

/* CREATE USER */

export function* addUserWatcher() {
  yield takeLatest(SIGN_UP_REQUEST, addUserHandler);
}


function* addUserHandler(action) {
  try {
    // can add 'HTTP_PENDING' action to start a loading spinner
    const response = yield call(addUserAjax, action.userData);
    yield call(setAuthToken, response.token);
    yield put(signUpSuccess(response.user));
    yield put({ type: "TOKEN_AUTH" });
  } catch (err) {
    console.log('Err --> ', err);
    yield put(signUpFailure(err));
  }
}

/* UPDATE USER */

export function* updateUserWatcher() {
  yield takeLatest(UPDATE_USER_REQUEST, updateUserHandler);
}

function* updateUserHandler(action) {
  try {
    const response = yield call(updateUserAjax, action.userData);
    yield put(updateUserSuccess(response.user));
  } catch (err) {
    console.log('Err --> ', err);
    yield put(updateUserFailure(err));
  } 
}

/* DELETE USER */ 

export function* deleteUserWatcher() {
  yield takeLatest(DELETE_USER_REQUEST, deleteUserHandler);
}

function* deleteUserHandler(action) {
  try {
    const response = yield call(deleteUserAjax, action.id);
    yield put(deleteUserSuccess(response.userId));
  } catch (err) {
    console.log('Err --> ', err);
    yield put(deleteUserFailure(err));
  }
}

export default [
  fork(addUserWatcher),
  fork(fetchUsersWatcher),
  fork(updateUserWatcher),
  fork(deleteUserWatcher),
];

