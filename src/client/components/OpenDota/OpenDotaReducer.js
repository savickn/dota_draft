
import {  
  HERO_DATA_SUCCESS, 
  ITEM_DATA_SUCCESS,
  ABILITY_DATA_SUCCESS, 
  HERO_ITEMS_SUCCESS, 
} from './OpenDotaActions';

import { updateByObjectId } from '../../libs';

const initialState = {
  status: 'IDLE',
  errors: null,
  data: [], 
  items: [],
  abilities: [],
  
  matchups: [],
  heroItems: [],
};


const OpenDotaReducer = (state = initialState, action) => {
  switch(action.type) {
    case HERO_DATA_SUCCESS:
      return {
        ...state,
        data: action.heroes,  
      };

    case ITEM_DATA_SUCCESS:
      return {
        ...state,
        items: action.items,  
      };
      
    case ABILITY_DATA_SUCCESS:
      return {
        ...state,
        abilities: action.abilties,  
      };

    case HERO_ITEMS_SUCCESS:
      return {
        ...state,
        heroItems: action.heroItems, 
      }
    
    default:
      return state;
  }
}

export const getAllData = (state) => state.opendota.data;
export const getItemData = (state) => state.opendota.items;
export const getAbilityData = (state) => state.opendota.abilities;

export const getHeroById = (state, id) => state.opendota.data[id]; 

export const getHeroItems = (state) => state.opendota.heroItems;

export const getStatus = (state) => state.opendota.status;
export const getErrors = (state) => state.opendota.errors;


export default OpenDotaReducer;

