import { 
  FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE,
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, 
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE, 
  DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE, 
} from './UserActions';

import { updateByObjectId, removeByObjectId } from '../../util/utilFuncs';

/* Status can be:
* idle -> no request
* pending -> processing request
* error -> Errors occurred
*/

const initialState = {
  status: 'idle',
  collection: [],
  errors: null
};

const UserReducer = (state = initialState, action) => {
  switch(action.type) {
    case SIGN_UP_REQUEST:
      return {
        ...state, 
        status: 'pending',
        errors: null
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state, 
        status: 'idle',
        collection: [...state.collection, action.user],
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        status: 'error',
        errors: action.errors,
      };

    case FETCH_USERS_REQUEST:
      return {
        ...state,
        status: 'pending',
        errors: null
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        status: 'idle',
        collection: [...action.users]
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        status: 'error',
        errors: action.errors
      };

    case UPDATE_USER_REQUEST:
      return {
        ...state,
        status: 'pending',
        errors: null
      }
    case UPDATE_USER_SUCCESS:
      return {
        ...state, 
        status: 'idle',
        collection: updateByObjectId(state.collection, action.user)
      }
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        status: 'error',
        errors: action.errors
      }

    case DELETE_USER_REQUEST:
      return {
        ...state,
        status: 'pending',
        errors: null
      }
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        status: 'idle',
        collection: removeByObjectId(state.collection, action.id)
      }
    case DELETE_USER_FAILURE:
      return {
        ...state,
        status: 'error',
        errors: action.errors
      }
    default:
      return state;
  }
}

export const getUsers = (state) => state.users.collection;
export const getUserById = (state, id) => state.users.collection.filter(user => user.cuid === id)[0];
export const getUserErrors = (state) => state.users.errors;

export default UserReducer;
