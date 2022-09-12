
export const HERO_RECOMMENDATION_REQUEST = 'HERO_RECOMMENDATION_REQUEST';
export const HERO_RECOMMENDATION_SUCCESS = 'HERO_RECOMMENDATION_SUCCESS';

export const ANALYTICS_REQUEST = 'ANALYTICS_REQUEST';
export const ANALYTICS_SUCCESS = 'ANALYTICS_SUCCESS';


export function heroRecommendationRequest(payload) {
  return {
    type: HERO_RECOMMENDATION_REQUEST, 
    payload, 
  }
}

export function heroRecommendationSuccess(recommendations) {
  return {
    type: HERO_RECOMMENDATION_SUCCESS,
    recommendations, 
  }
}


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




