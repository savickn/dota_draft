
// registers sub-documents in the Redux Store (e.g. state.users, state.posts)
import app from './components/App/AppReducer';
import account from './components/User/AccountReducer';
import users from './components/User/UserReducer';
import heroes from './components/Hero/HeroReducer';
import draft from './components/Draft/DraftReducer';
import opendota from './components/OpenDota/OpenDotaReducer';

import alerts from './components/Utility/Alert/alertReducer';
import modal from './components/Utility/Modal/modalReducer';

/*
** return list of Reducers which will be combined 
** via 'combineReducers'
*/
let reducers = {
  app,
  alerts,  
  modal,   
  
  account,
  users,
  heroes, 
  draft, 
  opendota,
 
};

export default reducers;
