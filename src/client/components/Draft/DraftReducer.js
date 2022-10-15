


import { 
  HERO_RECOMMENDATION_REQUEST, HERO_RECOMMENDATION_SUCCESS, 
  ANALYTICS_REQUEST, ANALYTICS_SUCCESS, 
} from './DraftActions';

const initialState = {
  radiant: {},
  dire: {}, 
  recommendations: {},
  analytics: {},
};


const DraftReducer = (state = initialState, action) => {
  switch(action.type) {
        
    case HERO_RECOMMENDATION_SUCCESS:
      return Object.assign({}, state, {
        recommendations: action.recommendations,
      });

    case ANALYTICS_SUCCESS:
      return Object.assign({}, state, {
        analytics: action.analytics, 
      });

    
    default:
      return state;
  }
}

export const radiant = (state) => state.draft.radiant;
export const dire = (state) => state.draft.dire;
export const getHeroRecommendations = (state) => state.draft.recommendations;
export const getAnalytics = (state) => state.draft.analytics;


export default DraftReducer;

