
import { 
  UPDATE_DRAFT_SUCCESS, 
  UPDATE_LANES_SUCCESS,
  SEARCH_RECOMMENDATIONS_SUCCESS,   
  UPDATE_RECOMMENDATIONS_SUCCESS, 
  ANALYTICS_SUCCESS,
  LOAD_DRAFT_SUCCESS, 
} from './DraftActions'; 

const initialState = {
  radiant: [],
  dire: [], 
  banned: [],
  recommendations: {},

  positions: {
    r_C: [], r_M: [], r_O: [], r_4: [], r_5: [],
    d_C: [], d_M: [], d_O: [], d_4: [], d_5: [],
  },
  LOCKED: [], // used to track positions that are locked 

  search: [], 
  analytics: { 
    'RAD': null,
    'DIRE': null, 
  },
};


const DraftReducer = (state = initialState, action) => {
  switch(action.type) {

    case UPDATE_LANES_SUCCESS:
      return Object.assign({}, state, {
        positions: {
          ...state.positions,
          ...action.positions, 
        }
      })



    case UPDATE_DRAFT_SUCCESS:
      return Object.assign({}, state, {
        radiant: action.radiant, 
        dire: action.dire, 
      })
        
    case UPDATE_RECOMMENDATIONS_SUCCESS:
      return Object.assign({}, state, {
        radiant: action.radiant, 
        dire: action.dire, 
        recommendations: action.recommendations,
      });

    case ANALYTICS_SUCCESS:
      return Object.assign({}, state, {
        analytics: action.analytics, 
      });

    case SEARCH_RECOMMENDATIONS_SUCCESS:
      return Object.assign({}, state, {
        search: action.results, 
      });
    
    case LOAD_DRAFT_SUCCESS:
      return Object.assign({}, state, {
        radiant: action.draft.radiant,
        dire: action.draft.dire,
        positions: action.draft.positions, 
      });

    

    default:
      return state;
  }
}

export const getDraft = (state) => state.draft;
export const getRadiant = (state) => state.draft.radiant;
export const getDire = (state) => state.draft.dire;
export const getRecommendations = (state) => state.draft.recommendations;
export const getBanned = (state) => state.draft.banned; 
export const getSearchResults = (state) => state.draft.search;
export const getPositions = (state) => state.draft.positions;
export const getAnalytics = (state) => state.draft.analytics;

// basically get specific heroes from 'recommendations' collection
export const searchRecommendationsByName = (state, name) => {

  // return nothing if no filter string is provided
  if(name.length < 1) {
    return [];
  }

  const regex = new RegExp(name, 'i');
  let heroes = [];
  let names = [];
  Object.values(state.draft.recommendations).forEach(arr => {
    arr.forEach(hero => {
      if(regex.test(hero.localized_name) && !names.includes(hero.localized_name)) {
        heroes.push(hero);
        names.push(hero.localized_name);
      }
    })
  })
  return heroes;
}


export default DraftReducer;

