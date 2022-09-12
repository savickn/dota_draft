
import { takeLatest, call, put, fork } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import axios from '../../util/axiosCaller';

/* imports */

import { 
  HERO_RECOMMENDATION_REQUEST, ANALYTICS_REQUEST,
  heroRecommendationSuccess, analyticsSuccess, 
} from './DraftActions';

/* API Requests */

function getHeroRecommendations(query={}) {
  return axios.post('api/draft/', query)
  .then((res) => res.data )
  .catch((err) => { throw err; })
}


/* sagas */

export function* getRecommendationsWatcher() {
  yield takeLatest(HERO_RECOMMENDATION_REQUEST, getRecommendationsHandler);
}

export function* getRecommendationsHandler(action) {
  try {
    const res = yield call(getHeroRecommendations, action.payload);
    console.log(res);
    yield put(heroRecommendationSuccess(res.recommendations));
  } catch(error) {
    console.log(error);
  }
}


/* exports */

export default [
  fork(getRecommendationsWatcher), 
];
