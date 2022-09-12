import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_OUT_SUCCESS } from './AccountActions';

const initialState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

/* Status can be:
* idle -> 
* loading -> processing login request
* authenticated -> login successful
* error -> Errors occurred
* logout -> login failure/logged out of system
*/

const AccountReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOG_IN_REQUEST:
      return Object.assign({}, state, {
        status: 'loading',
        error: null
      });
    case LOG_IN_SUCCESS:
      return Object.assign({}, state, {
        status: 'authenticated',
        currentUser: action.user,
      });
    case LOG_IN_FAILURE:
      return Object.assign({}, state, {
        status: 'error',
        error: action.error,
      });
    case LOG_OUT_SUCCESS:
      return Object.assign({}, state, {
        status: 'logout',
        currentUser: null,
      });
    default:
      return state;
  }
}

export const getCurrentUser = (state) => state.account.currentUser || {};
export const getAccountStatus = (state) => state.account.status;
export const getAccountErrors = (state) => state.account.error;

// isAuth should probably check token as well tho
export const isAuthenticated = (state) => state.account.status === 'authenticated';
export const hasRole = (state, role='user') => {
  const currentUser = state.account.currentUser;
  if(!currentUser) return false;
  if(currentUser.role === 'admin') return true;
  return currentUser.role === role;
}

// checks if currently logged-in user is the owner of the target resource
export const isCorrectUser = (state, targetUser) => {
  const currentUser = state.account.currentUser;
  if(!currentUser) return false;
  return currentUser._id === targetUser._id;
}

export default AccountReducer;
