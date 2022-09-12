
import { takeLatest, put, fork, delay } from 'redux-saga/effects';


export function* alertWatcher() {
  yield takeLatest('NEW_ALERT', alertHandler);
}

function* alertHandler(action) {
  yield put({type: 'SET_ALERT', alert: action.alert});
  yield delay(10000);
  yield put({type: 'REMOVE_ALERT'});
} 

export default [
  alertWatcher(),
]