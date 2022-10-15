
export const SEARCH_MATCHUPS_REQUEST = 'SEARCH_MATCHUPS_REQUEST';
export const SEARCH_MATCHUPS_SUCCESS = 'SEARCH_MATCHUPS_SUCCESS';
export const SEARCH_MATCHUPS_ERROR = 'SEARCH_MATCHUPS_ERROR';


export const FETCH_MATCHUP_REQUEST = 'FETCH_MATCHUP_REQUEST';
export const FETCH_MATCHUP_SUCCESS = 'FETCH_MATCHUP_SUCCESS';
export const FETCH_MATCHUP_ERROR = 'FETCH_MATCHUP_ERROR';

/* INDIVIDUAL MATCHUP */

export function fetchMatchupRequest(matchupId) {
  return {
    type: FETCH_MATCHUP_REQUEST,
    matchupId, 
  }
}

export function fetchMatchupSuccess(matchup) {
  return {
    type: FETCH_MATCHUP_SUCCESS,
    matchup, 
  }
}

export function fetchMatchupError(error) {
  return {
    type: FETCH_MATCHUP_ERROR,
    error, 
  }
}

/* HERO COLLECTION */

export function searchMatchupsRequest(searchArgs, pageArgs) {
  return {
    type: SEARCH_MATCHUPS_REQUEST,
    payload: {
      search: searchArgs,
      pagination: pageArgs, 
    }
  }
}

export function searchMatchupsSuccess(matchups) {
  return {
    type: SEARCH_MATCHUPS_SUCCESS,
    payload: {
      matchups, 
    } 
  }
}

export function searchMatchupsError(error) {
  return {
    type: SEARCH_MATCHUPS_ERROR,
    error, 
  }
}
