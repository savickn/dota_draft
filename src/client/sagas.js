
import AccountSagas from './components/User/AccountSagas';
import UserSagas from './components/User/UserSagas';
import HeroSagas from './components/Hero/HeroSagas';
import DraftSagas from './components/Draft/DraftSagas';
import MatchupSagas from './components/HeroData/HeroDataSagas'

import OpenDotaSagas from './components/OpenDota/OpenDotaSagas';

import AlertSagas from './components/Utility/Alert/alertSagas';

import { all } from 'redux-saga/effects'

export default function* rootSaga() {
  yield all([
    ...AccountSagas,
    ...UserSagas, 
    ...AlertSagas,
    ...HeroSagas,
    ...OpenDotaSagas,
    ...DraftSagas,  
  ])
}

