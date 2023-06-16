
export const SEARCH_RECOMMENDATIONS_REQUEST = 'SEARCH_RECOMMENDATIONS_REQUEST';
export const SEARCH_RECOMMENDATIONS_SUCCESS = 'SEARCH_RECOMMENDATIONS_SUCCESS';

export const UPDATE_RECOMMENDATIONS_REQUEST = 'UPDATE_RECOMMENDATIONS_REQUEST';
export const UPDATE_RECOMMENDATIONS_SUCCESS = 'UPDATE_RECOMMENDATIONS_SUCCESS';

export const ANALYTICS_REQUEST = 'ANALYTICS_REQUEST';
export const ANALYTICS_SUCCESS = 'ANALYTICS_SUCCESS';

export const UPDATE_DRAFT_REQUEST = 'UPDATE_DRAFT_REQUEST';
export const UPDATE_DRAFT_SUCCESS = 'UPDATE_DRAFT_SUCCESS';

export const SAVE_DRAFT_REQUEST = 'SAVE_DRAFT_REQUEST';

export const LOAD_DRAFT_REQUEST = 'LOAD_DRAFT_REQUEST';
export const LOAD_DRAFT_SUCCESS = 'LOAD_DRAFT_SUCCESS';

export const UPDATE_LANES_REQUEST = 'UPDATE_LANES_REQUEST';
export const UPDATE_LANES_SUCCESS = 'UPDATE_LANES_SUCCESS';



/* update team in redux store */ 

export function updateDraftRequest(radiant, dire) {
  return {
    type: UPDATE_DRAFT_REQUEST, 
    radiant, 
    dire, 
  }
}

export function updateDraftSuccess(radiant, dire) {
  return {
    type: UPDATE_DRAFT_SUCCESS, 
    radiant,
    dire, 
  }
}

/* send request to server to update Draft heroes */

export function updateRecommendationsRequest(payload) {
  return {
    type: UPDATE_RECOMMENDATIONS_REQUEST, 
    payload, 
  }
}

export function updateRecommendationsSuccess(recommendations, radiant, dire) {
  return {
    type: UPDATE_RECOMMENDATIONS_SUCCESS,
    recommendations, 
    radiant, 
    dire, 
  }
}

/*  */

export function searchRecommendationsRequest(text) {
  return {
    type: SEARCH_RECOMMENDATIONS_REQUEST, 
    text, 
  }
}

export function searchRecommendationsSuccess(results) {
  return {
    type: SEARCH_RECOMMENDATIONS_SUCCESS,
    results, 
  }
}

/* laning requests */

export function updateLanesSuccess(positions) {
  return {
    type: UPDATE_LANES_SUCCESS,
    positions, 
  }
}

/* save/load draft */

export function saveDraftRequest(key) {
  return {
    type: SAVE_DRAFT_REQUEST,
    key, 
  }
}

export function loadDraftRequest(key) {
  return {
    type: LOAD_DRAFT_REQUEST,
    key, 
  }
}

export function loadDraftSuccess(draft) {
  return {
    type: LOAD_DRAFT_SUCCESS, 
    draft, 
  }
}


/* request for team analytics */ 

export function analyticsRequest() {
  return {
    type: ANALYTICS_REQUEST, 
  }
}

export function analyticsSuccess(analytics) {
  return {
    type: ANALYTICS_SUCCESS,
    analytics, 
  }
}






