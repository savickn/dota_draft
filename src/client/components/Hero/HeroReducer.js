
import {  
  SEARCH_HEROES_REQUEST, SEARCH_HEROES_SUCCESS, SEARCH_HEROES_ERROR, 
  FETCH_HERO_REQUEST, FETCH_HERO_SUCCESS, FETCH_HERO_ERROR, 
  ADD_HERO_REQUEST, ADD_HERO_SUCCESS, ADD_HERO_ERROR, 
  UPDATE_HERO_REQUEST, UPDATE_HERO_SUCCESS, UPDATE_HERO_ERROR, 
  SYNC_HEROES_REQUEST, SYNC_HEROES_SUCCESS,
} from './HeroActions';

import { updateByObjectId } from '../../libs';

const initialState = {
  status: 'IDLE',
  errors: null,
  data: [], 
  search: [],
  current: null, 
};


const HeroReducer = (state = initialState, action) => {
  switch(action.type) {
    case SEARCH_HEROES_REQUEST:
      return {
        status: 'LOADING',
        search: [], 
        errors: state.errors, 
      };

    case SEARCH_HEROES_SUCCESS:
      return {
        status: 'IDLE',
        errors: null,
        search: action.payload.heroes, 
      };

    case SEARCH_HEROES_ERROR:
      return {
        status: 'ERROR',
        search: [], 
        errors: action.errors, 
      };


    case SYNC_HEROES_REQUEST:
      return {
        status: 'LOADING',
        data: [], 
        errors: state.errors, 
      };

    case SYNC_HEROES_SUCCESS:
      return {
        status: 'IDLE',
        errors: null,
        data: action.heroes, 
      };


    case FETCH_HERO_REQUEST:
      return Object.assign({}, state, {
        status: 'BUSY',
        current: [], 
        errors: null, 
      });

    case FETCH_HERO_SUCCESS:
      return Object.assign({}, state, {
        status: 'IDLE',
        data: [action.hero],
      });

    case FETCH_HERO_ERROR:
      return Object.assign({}, state, {
        status: 'IDLE',
        errors: action.errors, 
      });


    case ADD_HERO_REQUEST:
      return Object.assign({}, state, {
        status: 'IDLE',
      });
        
    case ADD_HERO_SUCCESS:
      return Object.assign({}, state, {
        errors: null,
        data: [...state.data, action.payload.hero], 
      });
    
    case ADD_HERO_ERROR:
      return Object.assign({}, state, {
        status: 'IDLE',
      });


    case UPDATE_HERO_REQUEST:
      return Object.assign({}, state, {
        status: 'IDLE',
      });
        
    case UPDATE_HERO_SUCCESS:
      return Object.assign({}, state, {
        errors: null,
        data: updateByObjectId(state.data, action.payload.hero),
      });
    
    case UPDATE_HERO_ERROR:
      return Object.assign({}, state, {
        status: 'IDLE',
      });

    

    
    default:
      return state;
  }
}

export const getHeroes = (state) => state.heroes.data;
export const getHeroesSearch = (state) => state.heroes.data;
export const getHero = (state, id) => state.heroes.data.filter(elem => elem._id === id)[0];
//export const getHero = (state, id) => state.heroes.current[0];

export const getStatus = (state) => state.heroes.status;
export const getErrors = (state) => state.heroes.errors;


export default HeroReducer;

