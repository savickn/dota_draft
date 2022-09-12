
export const HERO_DATA_REQUEST = 'HERO_DATA_REQUEST';
export const HERO_DATA_SUCCESS = 'HERO_DATA_SUCCESS';

export const ITEM_DATA_REQUEST = 'ITEM_DATA_REQUEST';
export const ITEM_DATA_SUCCESS = 'ITEM_DATA_SUCCESS';

export const ABILITY_DATA_REQUEST = 'ABILITY_DATA_REQUEST';
export const ABILITY_DATA_SUCCESS = 'ABILITY_DATA_SUCCESS';



export const HERO_ITEMS_REQUEST = 'HERO_ITEMS_REQUEST';
export const HERO_ITEMS_SUCCESS = 'HERO_ITEMS_SUCCESS';


/* constants */

export function itemDataRequest() {
  return {
    type: ITEM_DATA_REQUEST, 
  }
}

export function itemDataSuccess(items) {
  return {
    type: ITEM_DATA_SUCCESS,
    items,
  }
}

export function abilityDataRequest() {
  return {
    type: ABILITY_DATA_REQUEST,
  }
}

export function abilityDataSuccess(abilities) {
  return {
    type: ABILITY_DATA_SUCCESS,
    abilities, 
  }
}

export function heroDataRequest() {
  return {
    type: HERO_DATA_REQUEST,
  }
}

export function heroDataSuccess(heroes) {
  return {
    type: HERO_DATA_SUCCESS,
    heroes,
  }
}


/* hero specific data */


export function heroItemsRequest(heroId) {
  return {
    type: HERO_ITEMS_REQUEST, 
    heroId, 
  }
}

export function heroItemsSuccess(heroItems) {
  return {
    type: HERO_ITEMS_SUCCESS,
    heroItems, 
  }
}



