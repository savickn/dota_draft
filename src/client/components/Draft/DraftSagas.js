
import { takeLatest, call, put, fork, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import axios from '../../util/axiosCaller';

import { searchRecommendationsByName, getDraft, } from './DraftReducer';

import { calcD } from './util/DraftFuncs';

/* imports */

import { 
  UPDATE_DRAFT_REQUEST, UPDATE_LANES_REQUEST, 
  SEARCH_RECOMMENDATIONS_REQUEST, UPDATE_RECOMMENDATIONS_REQUEST, 
  ANALYTICS_REQUEST, SAVE_DRAFT_REQUEST, LOAD_DRAFT_REQUEST,
  updateRecommendationsRequest, 
  searchRecommendationsSuccess, updateRecommendationsSuccess, 
  updateLanesSuccess, analyticsSuccess, loadDraftSuccess, 
} from './DraftActions';

/* helpers */

function getStringCount(positionStr) {
  let count = 0;
  for(let char of positionStr) {
    if(char === '1') {
      count++;
    }
  }
  return count;
}

const positionMap = ['C', 'M', 'O', '4', '5'];

function getMaxAtPosition(pool, i) {
  let posVals = pool.map(h => h.positionMatrix[i]);
  //console.log(posVals);
  let max = Math.max(...posVals);
  //console.log('max -- ', max);
  return max;
}


// only works for 5 heroes
function mapPositions2(pool, target) {
  let res = {};
  let misc = [];
  let picked = []; 
  let done = [];

  let positionOrder = {};
  positionOrder['C'] = getMaxAtPosition(pool, 0);
  positionOrder['M'] = getMaxAtPosition(pool, 1);
  positionOrder['O'] = getMaxAtPosition(pool, 2);
  positionOrder['4'] = getMaxAtPosition(pool, 3);
  positionOrder['5'] = getMaxAtPosition(pool, 4);

  console.log(positionOrder);

  let sortedPositions = Object.entries(positionOrder).sort(
    (a,b) => b[1] - a[1]);
  
  console.log(sortedPositions);

  let i = 0;
  while(pool.length > 0) {
    let position = sortedPositions[i][0]; 
    let idx = positionMap.indexOf(position); // 
    console.log(position);
    console.log(idx);

    pool = pool.sort((h1, h2) => h2.positionMatrix[idx] - h1.positionMatrix[idx]);
    //console.log('pool -- ', pool);
    let hero = pool[0];
    //console.log('hero -- ', hero);

    res[`${target}_${position}`] = [hero];

    // remove chosen hero from pool
    pool = pool.slice(1);
    i++;
  }

  // basically each iteration pick a hero for a position
  /*for(let i = 0; pool.length > 0; i++) {
    console.log(pool.length);
    let hero;
    
    // sort pool
    pool = pool.sort((h1, h2) => h2.positionMatrix[i] - h1.positionMatrix[i]);
    console.log('pool -- ', pool);
    hero = pool[0];

    res[`${target}_${positionMap[i]}`] = [hero];

    // remove chosen hero from pool
    pool = pool.slice(1);
  }*/
  console.log(res);

  return res;


  /*
    let heroes = {
    'Carries': pool.filter(h => h.position.charAt(0) === '1'),
    'Mids': pool.filter(h => h.position.charAt(1) === '1'),
    'Offs': pool.filter(h => h.position.charAt(2) === '1'),
    '4s': pool.filter(h => h.position.charAt(3) === '1'),
    '5s': pool.filter(h => h.position.charAt(4) === '1'),
  }

  // count how many of each position
  let positionCounts = {
    'Carries': heroes['Carries'].length,
    'Mids': heroes['Mids'].length,
    'Offs': heroes['Offs'].length,
    '4s': heroes['4s'].length,
    '5s': heroes['5s'].length,
  };

  console.log('heroes -- ', heroes);
  console.log(count);

  let entries = Object.entries(count).sort((a,b) => a[1] - b[1]);

  console.log('entries -- ', entries);

  // select each hero
  for(let i = 0; i < 5; i++) {
    let position = entries[i][0];
    let initial = position.charAt(0);
    let n = entries[i][1];
    console.log(position, n);

    if(n === 1) {
      let hero = heroes[position][0];
      if(!picked.includes(hero.localized_name)) {
        res[`target_${initial}`] = [hero]
        done.push(initial);
        picked.push(hero.localized_name);
      } else {

      }

    } else if(n > 1) {

    } else { // n === 0 case

    }


  }*/

}

// basically place heroes in correct positions... UPGRADE at some point
function mapPositions(team, target) {
  let res = {};
  let misc = [];
  let done = []; // tracks positions which are already determined

  // set obvious positions... maybe refactor
  for(let h of team) {
    if(h.position === '10000') {
      if(done.includes('C')) {
        misc.push(h);
      } else {
        res.addToArrayField(`${target}_C`, h);
        done.push('C');
      }
      team = team.filter(e => e.localized_name !== h.localized_name);
    }
    if(h.position === '01000') {
      if(done.includes('M')) {
        misc.push(h);
      } else {
        res.addToArrayField(`${target}_M`, h);
        done.push('M');
      }
      team = team.filter(e => e.localized_name !== h.localized_name);
    }
    if(h.position === '00100') {
      if(done.includes('O')) {
        misc.push(h);
      } else {
        res.addToArrayField(`${target}_O`, h);
        done.push('O');
      }
      team = team.filter(e => e.localized_name !== h.localized_name);
    }
    if(h.position === '00010') {
      if(done.includes('4')) {
        misc.push(h);
      } else {
        res.addToArrayField(`${target}_4`, h);
        done.push('4');
      }
      team = team.filter(e => e.localized_name !== h.localized_name);
    }
    if(h.position === '00001') {
      if(done.includes('5')) {
        misc.push(h);
      } else {
        res.addToArrayField(`${target}_5`, h);
        done.push('5');
      }
      team = team.filter(e => e.localized_name !== h.localized_name);
    }
  };
  console.log(`${target}_team1 -- `, team);
  console.log(`${target}_res1 -- `, res);


  // set positions for non-obvious heroes
  for(let h of team) {
    if(h.position[0] === '1' && !done.includes('C')) {
      res.addToArrayField(`${target}_C`, h);
    }
    if(h.position[1] === '1' && !done.includes('M')) {
      res.addToArrayField(`${target}_M`, h);
    }
    if(h.position[2] === '1' && !done.includes('O')) {
      res.addToArrayField(`${target}_O`, h);
    }
    if(h.position[3] === '1' && !done.includes('4')) {
      res.addToArrayField(`${target}_4`, h);
    }
    if(h.position[4] === '1' && !done.includes('5')) {
      res.addToArrayField(`${target}_5`, h);
    }
  }
  console.log(`${target}_team2 -- `, team);
  console.log(`${target}_res2 -- `, res);
  console.log(`${target}_misc -- `, misc);

  // fill empty positions with misc
  while(misc.length > 0) {
    if(!res.hasOwnProperty(`${target}_C`)) {
      res.addToArrayField(`${target}_C`, misc.pop());
    }
    if(!res.hasOwnProperty(`${target}_M`)) {
      res.addToArrayField(`${target}_M`, misc.pop());
    }
    if(!res.hasOwnProperty(`${target}_O`)) {
      res.addToArrayField(`${target}_O`, misc.pop());
    }
    if(!res.hasOwnProperty(`${target}_4`)) {
      res.addToArrayField(`${target}_4`, misc.pop());
    }
    if(!res.hasOwnProperty(`${target}_5`)) {
      res.addToArrayField(`${target}_5`, misc.pop());
    }
  }

  return res;
}

function determineLanes(radiant, dire) {
  let r = mapPositions2(radiant, 'r');
  let d = mapPositions2(dire, 'd');
  let res = Object.assign({}, r, d);
  return res;
}


/* localStorage */

function saveToLocalStorage(key, draft) {
  let val = JSON.parse(localStorage.getItem('drafts'));
  if(!val) val = {}

  let d = new Date();
  let k = `${key}-${d.getMonth()}-${d.getDate()}-${d.getMilliseconds()}`
  let obj = {
    radiant: draft.radiant,
    dire: draft.dire,
    positions: draft.positions, 
  };
  val[key] = obj;

  localStorage.setItem('drafts', JSON.stringify(val));
}

function getFromLocalStorage(key) {
  let val = JSON.parse(localStorage.getItem('drafts'));
  return val[key];
}


/* API Requests */

function getHeroRecommendations(query={}) {
  return axios.post('api/draft/', query)
  .then((res) => res.data )
  .catch((err) => { throw err; })
}

function getHeroRecsByWinrate(query={}) {
  return axios.post('api/draft/byWinrate', query)
  .then((res) => res.data )
  .catch((err) => { throw err; })
}


/* sagas */

export function* updateLanesWatcher() {
  yield takeLatest(UPDATE_LANES_REQUEST, updateLanesHandler);
}

export function* updateLanesHandler(action) {
  try {

    // figure out lanes ... should probably only call if tab changes to 'Laning'
    const lanes = yield call(determineLanes, radiant, dire);
    console.log(lanes);

    // send lane + draft data to redux
    yield put(updateLanesSuccess(lanes));
  } catch(error) {
    console.log(error);
  }
}


export function* getRecommendationsWatcher() {
  yield takeLatest(UPDATE_RECOMMENDATIONS_REQUEST, getRecommendationsHandler);
}

export function* getRecommendationsHandler(action) {
  try {
    // get draft data from server
    //const { recommendations, radiant, dire } = yield call(getHeroRecsByWinrate, action.payload);
    
    // change to localStorage except once per week
    const { radHeroes, direHeroes, recommendedHeroes } = yield call(getHeroRecsByWinrate, action.payload);
    console.log('rad --> ', radHeroes);
    console.log('dire --> ', direHeroes);
    console.log('rec --> ', recommendedHeroes);

    const { radiant, dire, recommendations } = calcD(radHeroes, direHeroes, recommendedHeroes); 


    const lanes = yield call(determineLanes, radiant, dire);
    console.log(lanes);

    // send lane + draft data to redux
    yield put(updateLanesSuccess(lanes));
    yield put(updateRecommendationsSuccess(recommendations, radiant, dire));
  } catch(error) {
    console.log(error);
  }
}

export function* searchRecommendationsWatcher() {
  yield takeLatest(SEARCH_RECOMMENDATIONS_REQUEST, searchRecommendationsHandler);
}

export function* searchRecommendationsHandler(action) {
  try {
    let data = yield select(searchRecommendationsByName, action.text);
    console.log(data);
    yield put(searchRecommendationsSuccess(data));
  } catch(error) {
    console.log(error);
  }
}


export function* saveDraftWatcher() {
  yield takeLatest(SAVE_DRAFT_REQUEST, saveDraftHandler);
}

export function* saveDraftHandler(action) {
  try {
    let draft = yield select(getDraft);
    console.log(draft);
    yield call(saveToLocalStorage, action.key, draft);
    // maybe add some success message
  } catch(error) {
    console.log(error);
  }
}


export function* loadDraftWatcher() {
  yield takeLatest(LOAD_DRAFT_REQUEST, loadDraftHandler);
}

export function* loadDraftHandler(action) {
  try {
    let draft = yield call(getFromLocalStorage, action.key);
    console.log(draft);
    yield put(loadDraftSuccess(draft));
    yield put(updateRecommendationsRequest(draft));
    // maybe add some success message
  } catch(error) {
    console.log(error);
  }
}


/* exports */

export default [
  fork(getRecommendationsWatcher), 
  fork(searchRecommendationsWatcher), 
  fork(saveDraftWatcher),
  fork(loadDraftWatcher), 
];
