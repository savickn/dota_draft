
export function* addHeroWatcher() {
  yield takeLatest(ADD_HERO_REQUEST, addHeroHandler);
}

export function* addHeroHandler(action) {
  try {
    const res = yield call(addHero, action.payload.args);
    console.log(res);
    yield put(addHeroSuccess(res.hero));
  } catch(error) {
    console.log(error);
    yield put(addHeroError(error));
  }
}

/* update hero */

export function* updateHeroWatcher() {
  yield takeLatest(UPDATE_HERO_REQUEST, updateHeroHandler);
}

export function* updateHeroHandler(action) {
  try {
    console.log(action);
    const res = yield call(updateHero, action.payload.args, action.payload.id);
    console.log(res);
    yield put(updateHeroSuccess(res.hero));
  } catch(error) {
    console.log(error);
    yield put(updateHeroError(error));
  }
}



/*
** Export Watchers
*/

export default [
  fork(addToStorageWatcher),
  fork(get),
];
