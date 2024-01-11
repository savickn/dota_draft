
export const SEARCH_HEROES_REQUEST = 'SEARCH_HEROES_REQUEST';
export const SEARCH_HEROES_SUCCESS = 'SEARCH_HEROES_SUCCESS';
export const SEARCH_HEROES_ERROR = 'SEARCH_HEROES_ERROR';

export const FETCH_HERO_REQUEST = 'FETCH_HERO_REQUEST';
export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_HERO_ERROR = 'FETCH_HERO_ERROR';

export const ADD_HERO_REQUEST = 'ADD_HERO_REQUEST';
export const ADD_HERO_SUCCESS = 'ADD_HERO_SUCCESS';
export const ADD_HERO_ERROR = 'ADD_HERO_ERROR';

export const DELETE_HERO_REQUEST = 'DELETE_HERO_REQUEST';
export const DELETE_HERO_SUCCESS = 'DELETE_HERO_SUCCESS';
export const DELETE_HERO_ERROR = 'DELETE_HERO_ERROR';

export const UPDATE_HERO_REQUEST = 'UPDATE_HERO_REQUEST';
export const UPDATE_HERO_SUCCESS = 'UPDATE_HERO_SUCCESS';
export const UPDATE_HERO_ERROR = 'UPDATE_HERO_ERROR';

export const SYNC_HEROES_REQUEST = 'SYNC_HEROES_REQUEST';
export const SYNC_HEROES_SUCCESS = 'SYNC_HEROES_SUCCESS';

/* ADD HERO */

export function addHeroRequest(args) {
  return {
    type: ADD_HERO_REQUEST,
    payload: {
      args,
    }
  }
}

export function addHeroSuccess(hero) {
  return {
    type: ADD_HERO_SUCCESS,
    payload: {
      hero,
    } 
  }
}

export function addHeroError(error) {
  return {
    type: ADD_HERO_ERROR,
    error, 
  }
}

/* UPDATE HERO */

export function updateHeroRequest(args, id) {
  return {
    type: UPDATE_HERO_REQUEST,
    payload: {
      args,
      id
    }
  }
}

export function updateHeroSuccess(hero) {
  return {
    type: UPDATE_HERO_SUCCESS,
    payload: {
      hero,
    } 
  }
}

export function updateHeroError(error) {
  return {
    type: UPDATE_HERO_ERROR,
    error, 
  }
}


/* HERO COLLECTION */

export function searchHeroesRequest(searchArgs, pageArgs) {
  return {
    type: SEARCH_HEROES_REQUEST,
    payload: {
      search: searchArgs,
      pagination: pageArgs, 
    }
  }
}

export function searchHeroesSuccess(heroes) {
  return {
    type: SEARCH_HEROES_SUCCESS,
    payload: {
      heroes, 
    } 
  }
}

export function searchHeroesError(error) {
  return {
    type: SEARCH_HEROES_ERROR,
    error, 
  }
}

/* SYNC HEROES */

export function syncHeroesRequest() {
  return {
    type: SYNC_HEROES_REQUEST,
  }
}

export function syncHeroesSuccess(heroes) {
  return {
    type: SEARCH_HEROES_SUCCESS,
    payload: {
      heroes, 
    } 
  }
}


/* INDIVIDUAL HEROS */

export function fetchHeroRequest(heroId) {
  return {
    type: FETCH_HERO_REQUEST,
    heroId, 
  }
}

export function fetchHeroSuccess(hero) {
  return {
    type: FETCH_HERO_SUCCESS,
    hero, 
  }
}

export function fetchHeroError(error) {
  return {
    type: FETCH_HERO_ERROR,
    error, 
  }
}




