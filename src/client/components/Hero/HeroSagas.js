
import { takeLatest, call, put, fork } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import axios from '../../util/axiosCaller';
import { getDifferenceInDays } from '../../util/DateUtil';

import {
  SEARCH_HEROES_REQUEST, FETCH_HERO_REQUEST, ADD_HERO_REQUEST,
  searchHeroesSuccess, fetchHeroSuccess, addHeroSuccess,
  searchHeroesError, fetchHeroError, addHeroError, 
  addHeroRequest, UPDATE_HERO_REQUEST, updateHeroSuccess,
  SYNC_HEROES_REQUEST, syncHeroesSuccess
} from './HeroActions'; 

import * as heroService from './HeroService';

/*
** API Requests
*/

// sync all heroes to localStorage
// or retrieve subset of heroes based on query args
function searchHeroes(search={}, pagination={}) {
  return axios.get('api/heroes', {
    params: {
      search,
      pagination, 
    }, 
  })
  .then((res) => res.data )
  .catch((err) => { throw err; })
}

// get all data for specific Product
function fetchHero(heroId) {
  return axios.get(`api/heroes/${heroId}`)
    .then((res) => res.data)
    .catch((err) => { throw err; })
}

// add Hero api call
function addHero(hero) {
  return axios.post('api/heroes/', hero)
  .then(res => res.data )
  .catch(err => { throw err; })
}

// update Hero api call
// 'updates' is object with one or more updated fields
function updateHero(updates, heroId) {
  return axios.put(`api/heroes/${heroId}`, updates)
  .then(res => res.data)
  .catch(err => { throw err; })
}

/* SEARCH -- get subset of heroes (exclude unavailable heroes and search) */

export function* searchHeroesWatcher() {
  yield takeLatest(SEARCH_HEROES_REQUEST, searchHeroesHandler);
}

export function* searchHeroesHandler(action) {
  try {
    //const { freshSearch, freshPagination } = checkLocalStorage(action.payload.search, action.payload.pagination);
    const res = yield call(searchHeroes, action.payload.search, action.payload.pagination);
    console.log('fetchHeroes res --> ', res);
    yield put(searchHeroesSuccess(res.heroes));
  } catch(error) {
    console.log('fetchHeroes error --> ', error);
    yield put(searchHeroesError(error));
  }
}


/* SYNC - populate client-side with all heroes */

export function* syncHeroesWatcher() {
  yield takeLatest(SYNC_HEROES_REQUEST, syncHeroesHandler);
}

export function* syncHeroesHandler(action) {
  try {
    const isCached = heroService.isFresh();
    if(isCached) {
      console.log('hello');
      const res = heroService.loadHeroes();
      console.log('heroesFromLocalStorage --> ', res);
      yield put(searchHeroesSuccess(res));
    } else {
      const res = yield call(searchHeroes);
      console.log('heroesFromServer --> ', res);
      heroService.saveHeroes(res.heroes);
      yield put(searchHeroesSuccess(res.heroes));
    }
  } catch(error) {
    console.log('fetchHeroes error --> ', error);
    yield put(searchHeroesError(error));
  }
}


/*
** get family of Products via 'pid'
*/

export function* fetchHeroWatcher() {
  yield takeLatest(FETCH_HERO_REQUEST, fetchHeroHandler);
}

export function* fetchHeroHandler(action) {
  try {
    const res = yield call(fetchHero, action.heroId);
    console.log('fetchProduct res --> ', res);
    yield put(fetchHeroSuccess(res.hero));
  } catch(error) {
    console.log('fetchProduct error --> ', error);
    yield put(fetchHeroError(error));
  }
}


/* add hero */

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
    //yield put(updateHeroError(error));
  }
}




/*
** Export Watchers
*/

export default [
  fork(addHeroWatcher),
  fork(searchHeroesWatcher),
  fork(fetchHeroWatcher),
  fork(updateHeroWatcher),
  fork(syncHeroesWatcher), 
];
