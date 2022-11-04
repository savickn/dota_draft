
import React from 'react';
import { Route, Switch } from 'react-router-dom';

//import ProtectedRoute from './components/ProtectedRoute/protectedRoute';

import HomePage from './components/App/components/Home/HomePage';
import LoginPage from './components/User/pages/UserLoginPage/UserLoginPage';
import SignUpPage from './components/User/pages/UserCreatePage/UserCreatePage';
import ProfilePage from './components/User/pages/UserProfilePage/UserProfilePage';

import DraftPage from './components/Draft/pages/DraftPage';
import PractiseDraftPage from './components/Draft/pages/PractiseDraftPage';
import QuizHomePage from './components/Quiz/QuizHomePage';
import CounterQuiz from './components/Quiz/CounterQuiz';
import DraftCounterQuiz from './components/Quiz/DraftCounterQuiz';
import DraftSynergyQuiz from './components/Quiz/DraftSynergyQuiz';
import LaneMatchupPage from './components/Lane/LaneMatchupPage';

import HeroCollectionPage from './components/Hero/pages/HeroCollectionPage';
import HeroPage from './components/Hero/pages/HeroPage';
import HeroVisualizerPage from './components/Hero/pages/HeroVisualizerPage';

export default (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/heroes" component={HeroCollectionPage} />
    <Route path="/heroes/:pid" component={HeroPage} />
    <Route path="/visualizer" component={HeroVisualizerPage} />
    <Route exact path="/draft" component={DraftPage} />
    <Route exact path="/lane" component={LaneMatchupPage} />
    <Route path="/practiseDraft" component={PractiseDraftPage} />

    <Route path="/quiz" component={QuizHomePage} exact />
    <Route path="/quiz/counters" component={CounterQuiz} />
    <Route path="/quiz/draftCounter" component={DraftCounterQuiz} />
    <Route path="/quiz/draftSynergy" component={DraftSynergyQuiz} />

    <Route path="/users/new" component={SignUpPage} />
    <Route path="/users/login" component={LoginPage} />
    <Route path="/users/profile" component={ProfilePage} />
  </Switch>
)
