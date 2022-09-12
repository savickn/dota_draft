
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas';
import DevTools from './util/devTools';

const preloadedState = window.__PRELOADED_STATE__;
console.log('preloadedState client --> ', preloadedState);

const sagaMiddleware = createSagaMiddleware();

delete window.__PRELOADED_STATE__;

/*
**
*/
const registerReducers = (history) => {
  return combineReducers({
    router: connectRouter(history),
    ...reducers
  });
}

/*
**
*/
const registerEnhancers = (history) => {
  return compose(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
    ),
    DevTools.instrument()
  )
}

/*
**
*/
export default (history) => {
  //
  const reduxStore = createStore(
    registerReducers(history),
    preloadedState,
    registerEnhancers(history)
  );
  
  // for HMR
  if(module.hot) {
    module.hot.accept('./reducers', () => {
      console.log('hmr reducer');
      store.replaceReducer(require('./reducers').default)
    });
  }

  //
  sagaMiddleware.run(sagas);

  return reduxStore;
}


