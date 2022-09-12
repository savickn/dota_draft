
import { takeLatest, call, put, fork } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import axios from '../../util/axiosCaller';

import { 
  HERO_DATA_REQUEST, heroDataSuccess, 
  HERO_ITEMS_REQUEST, heroItemsSuccess } from './OpenDotaActions';

import { getDifferenceInDays } from '../../util/DateUtil';

/* helpers */ 

// returns /heroes expiry time
export function areHeroesFresh() {
  let currentTime = new Date(Date.now());
  let lastUpdated = new Date(JSON.parse(localStorage.getItem('heroesUpdatedOn')));
  let difference = getDifferenceInDays(currentTime, lastUpdated);
  return difference < 7;
}

// get specific hero data from localStorage
export function getHeroDataById(id) {
  return JSON.parse(localStorage.getItem('heroes'))[id];
}

export function getHeroDataInLocalStorage() {
  return JSON.parse(localStorage.getItem('heroes'));
}

function putHeroesInLocalStorage(heroes) {
  localStorage.setItem('heroes', JSON.stringify(heroes));
  localStorage.setItem('heroesUpdatedOn', JSON.stringify(Date.now()));
}


/* api calls */

function getHeroDataAll() {  
  return axios.get('api/od/heroes')
    .then((res) => res.data)
    .catch((err) => { throw err; })
}

function getItemData() {

}

function getAbilityData() {

}


function getHeroItems(id) {
  return axios.get(`api/od/heroItems/${id}`)
    .then((res) => res.data)
    .catch((err) => { throw err; })
}

/* watchers */

export function* getHeroDataWatcher() {
  yield takeLatest(HERO_DATA_REQUEST, getHeroDataHandler);
}

export function* getHeroDataHandler(action) {
  try {
    if(!areHeroesFresh()) {
      const res = yield call(getHeroDataAll);
      putHeroesInLocalStorage(res.heroes);     // update localStorage
      yield put(heroDataSuccess(res.heroes));
    } else {
      let heroes = getHeroDataInLocalStorage();
      yield put(heroDataSuccess(heroes));
    }
  } catch(error) {
    console.log('fetchData error --> ', error);
  }
}

export function* getHeroItemsWatcher() {
  yield takeLatest(HERO_ITEMS_REQUEST, getHeroItemsHandler);
}

export function* getHeroItemsHandler(action) {
  try {
      const res = yield call(getHeroItems, action.heroId);
      console.log(res);
      yield put(heroItemsSuccess(res.heroItems));
  } catch(error) {
    console.log('fetchData error --> ', error);
  }
}


/* forked exports */

export default [
  fork(getHeroDataWatcher),
  fork(getHeroItemsWatcher), 
];
