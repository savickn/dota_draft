
import React from 'react';
import { render, hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';

/* alternative to <link> to CDN */
//import 'bootstrap/dist/css/bootstrap.min.css';

import './libs.global.scss'; // used to import bootstrap from node_modules
import './styles.global.scss';
import './layouts.global.scss';

import './libs';

import App from './App';

const browserHistory = createBrowserHistory();
const reduxStore = require('./store').default(browserHistory);

hydrate(
  <App store={reduxStore} history={browserHistory} />,
  document.getElementById('root')
)

if(module.hot) {
  console.log('Using Hot Module Replacement...');
  //console.log('module.hot --> ', module.hot);
  module.hot.accept('./App', () => {
    console.log('HMR Component');
    /* For Webpack 2.x
       Need to disable babel ES2015 modules transformation in .babelrc
       presets: [
         ["es2015", { "modules": false }]
       ]
    */
    // should it be hydrate or render??
    render(
      <AppContainer>
        <App store={reduxStore} history={browserHistory} />
      </AppContainer>,
      document.getElementById('root')
    );
  })
}

