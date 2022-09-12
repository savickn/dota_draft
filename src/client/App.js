
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import AppComponent from './components/App/App';

export default function App(props) {
  return (
    <Provider store={props.store}>
      <ConnectedRouter history={props.history}>
        <AppComponent {...props} />
      </ConnectedRouter>
    </Provider>
  )
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};



