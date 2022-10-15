

import {  
  FETCH_HERODATA_REQUEST, FETCH_HERODATA_SUCCESS, FETCH_HERODATA_ERROR, 
} from './HeroDataActions';

import { updateByObjectId } from '../../libs';

const initialState = {
  status: 'IDLE',
  errors: null,
  data: [], 
  current: null, 
};


const HeroReducer = (state = initialState, action) => {
  switch(action.type) {
    case SEARCH_HERODATAES_REQUEST:
      return {
        status: 'LOADING',
        data: [], 
        errors: state.errors, 
      };

    case SEARCH_HERODATAES_SUCCESS:
      return {
        status: 'IDLE',
        errors: null,
        data: action.payload.heroes, 
      };

    case SEARCH_HERODATAES_ERROR:
      return {
        status: 'ERROR',
        data: [], 
        errors: action.errors, 
      };


    case FETCH_HERODATA_REQUEST:
      return Object.assign({}, state, {
        status: 'BUSY',
        current: [], 
        errors: null, 
      });

    case FETCH_HERODATA_SUCCESS:
      return Object.assign({}, state, {
        status: 'IDLE',
        data: [action.hero],
      });

    case FETCH_HERODATA_ERROR:
      return Object.assign({}, state, {
        status: 'IDLE',
        errors: action.errors, 
      });


    case ADD_HERODATA_REQUEST:
      return Object.assign({}, state, {
        status: 'IDLE',
      });
        
    case ADD_HERODATA_SUCCESS:
      return Object.assign({}, state, {
        errors: null,
        data: [...state.data, action.payload.hero], 
      });
    
    case ADD_HERODATA_ERROR:
      return Object.assign({}, state, {
        status: 'IDLE',
      });


    case UPDATE_HERODATA_REQUEST:
      return Object.assign({}, state, {
        status: 'IDLE',
      });
        
    case UPDATE_HERODATA_SUCCESS:
      return Object.assign({}, state, {
        errors: null,
        data: updateByObjectId(state.data, action.payload.hero),
      });
    
    case UPDATE_HERODATA_ERROR:
      return Object.assign({}, state, {
        status: 'IDLE',
      });

    
    default:
      return state;
  }
}

export const getHeroes = (state) => state.heroes.data;
export const getHero = (state, id) => state.heroes.data.filter(elem => elem._id === id)[0];
//export const getHero = (state, id) => state.heroes.current[0];

export const getStatus = (state) => state.heroes.status;
export const getErrors = (state) => state.heroes.errors;


export default HeroReducer;







